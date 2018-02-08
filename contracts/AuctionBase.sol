pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./erc721/ERC721.sol";

/// @title AuctionBase
/// @dev Contains models, variables, and internal methods for the auction.
contract AuctionBase is Pausable {

  // Active: Auction is accepting bids and is not cancelled.
  // Cancelled: The seller cancelled the auction.
  // Completed: Winning bid decided, but NFT and bid transfers are yet to happen.
  enum AuctionStatus { Active, Cancelled, Completed }

  struct Auction {
    // static
    address nftAddress; // NFT address
    uint256 tokenId; // ID of the nft
    address seller; // Current owner of NFT
    uint128 bidIncrement; // Minimum bid increment (in Wei)
    uint256 duration; // Block count for when the auction ends
    uint256 startBlock; // Block number when auction started
    uint256 startedAt; // Approximate time for when the auction was started

    // state
    mapping (address => uint256) fundsByBidder; // Mapping of addresses to funds
    uint256 highestBid; // Current highest bid
    address highestBidder; // Address of current highest bidder
    bool cancelled; // Flag for cancelled auctions
  }

  // Map from token ID to their corresponding auction ID.
  mapping (address => mapping(uint256 => uint256)) nftToTokenIdToAuctionId;
  Auction[] public auctions;

  event AuctionCreated(uint256 id, address nftAddress, uint256 tokenId);
  event AuctionSuccessful(uint256 id, address nftAddress, uint256 tokenId);
  event AuctionCancelled(uint256 id, address nftAddress, uint256 tokenId);
  event BidCreated(uint256 id, address nftAddress, uint256 tokenId, address bidder, uint256 bid);
  event AuctionWithdrawal(uint256 id, address nftAddress, uint256 tokenId, address withdrawer, uint256 amount);

  // External functions

  // @dev Retrieve auctions count
  function getAuctionsCount() public view returns (uint256) {
    return auctions.length;
  }

  // @dev Returns auction info for an NFT on auction.
  // @param _auctionId - auction index/ID
  function getAuction(uint256 _auctionId)
    external
    view
    returns
  (
    uint256 id,
    address nftAddress,
    uint256 tokenId,
    address seller,
    uint256 bidIncrement,
    uint256 duration,
    uint256 startedAt,
    uint256 startBlock,
    AuctionStatus status,
    uint256 highestBid,
    address highestBidder
  ) {
    Auction memory _auction = auctions[_auctionId];
    AuctionStatus _status = _getAuctionStatus(_auctionId);
    return (
      _auctionId,
      _auction.nftAddress,
      _auction.tokenId,
      _auction.seller,
      _auction.bidIncrement,
      _auction.duration,
      _auction.startedAt,
      _auction.startBlock,
      _status,
      _auction.highestBid,
      _auction.highestBidder
    );
  }

  // @dev Return bid for given auction ID and bidder
  function getBid(uint256 _auctionId, address bidder)
    external
    view
    returns (uint256 bid)
  {
    Auction storage auction = auctions[_auctionId];
    return auction.fundsByBidder[bidder];
  }

  // @dev Creates and begins a new auction.
  // @_duration is in seconds and is converted to block count.
  function createAuction(
    address _nftAddress,
    uint256 _tokenId,
    uint256 _bidIncrement,
    uint256 _duration
  )
    external
    whenNotPaused
  {
    // Get nft
    ERC721 nftContract = ERC721(_nftAddress);

    // Require msg.sender to own nft
    require(nftContract.ownerOf(_tokenId) == msg.sender);

    // Require duration to be at least a minute and calculate block count
    require(_duration >= 60);
    uint256 durationBlockCount = _duration / 14;

    // Put nft in escrow
    nftContract.transferFrom(msg.sender, this, _tokenId);

    Auction memory _auction = Auction({
      nftAddress: _nftAddress,
      tokenId: _tokenId,
      seller: msg.sender,
      bidIncrement: uint128(_bidIncrement),
      duration: durationBlockCount,
      startedAt: now,
      startBlock: block.number,
      highestBid: 0,
      highestBidder: address(0),
      cancelled: false
    });
    uint256 newAuctionId = auctions.push(_auction) - 1;

    // Add auction index to nftToTokenIdToAuctionId mapping
    nftToTokenIdToAuctionId[_nftAddress][_tokenId] = newAuctionId;

    AuctionCreated(newAuctionId, _nftAddress, _tokenId);
  }

  // @dev Implements a simplified English auction
  // Lets msg.sender bid highestBid + bidIncrement and stores bids in fundsByBidder
  // TODO: Look into the experience of bidding in an English Auction asyncronously
  function bid(uint256 _auctionId)
    external
    payable
    whenNotPaused
    statusIs(AuctionStatus.Active, _auctionId)
    returns (bool success)
  {
    require(msg.value > 0);

    Auction storage auction = auctions[_auctionId];

    // Require newBid be greater than or equal to highestBid + bidIncrement
    uint256 newBid = auction.fundsByBidder[msg.sender] + msg.value;
    require(newBid >= auction.highestBid + auction.bidIncrement);

    // Update fundsByBidder mapping
    auction.highestBid = newBid;
    auction.highestBidder = msg.sender;
    auction.fundsByBidder[auction.highestBidder] = newBid;

    // Emit BidCreated event
    BidCreated(_auctionId, auction.nftAddress, auction.tokenId, msg.sender, newBid);
    return true;
  }

  // @dev Allow people to withdraw their balances or the NFT
  function withdrawBalance(uint256 _auctionId) external returns (bool success) {
    AuctionStatus _status = _getAuctionStatus(_auctionId);

    // Don't let people withdraw before the auction is cancelled or completed
    require(_status == AuctionStatus.Cancelled || _status == AuctionStatus.Completed);

    Auction storage auction = auctions[_auctionId];
    address withdrawalAccount;
    uint withdrawalAmount;

    // Auction is cancelled
    if (_status == AuctionStatus.Cancelled) {
      withdrawalAccount = msg.sender;
      withdrawalAmount = auction.fundsByBidder[withdrawalAccount];
    }
    // Auction is completed
    else {
      // The seller gets the highest bid
      if (msg.sender == auction.seller) {
        withdrawalAccount = auction.highestBidder;
        withdrawalAmount = auction.highestBid;
      }
      // Highest bidder can only withdraw the NFT
      else if (msg.sender == auction.highestBidder) {
        _transfer(auction.nftAddress, auction.highestBidder, auction.tokenId);
      }
      // Anyone else gets what they bid
      else {
        withdrawalAccount = msg.sender;
        withdrawalAmount = auction.fundsByBidder[withdrawalAccount];
      }
    }

    require(withdrawalAmount > 0);
    auction.fundsByBidder[withdrawalAccount] -= withdrawalAmount;
    msg.sender.transfer(withdrawalAmount);

    AuctionWithdrawal(_auctionId, auction.nftAddress, auction.tokenId,
      withdrawalAccount, withdrawalAmount);
    return true;
  }

  function cancelAuction(address _nftAddress, uint256 _tokenId) external {
    uint256 auctionId = nftToTokenIdToAuctionId[_nftAddress][_tokenId];
    _cancelAuction(auctionId);
  }

  function cancelAuction(uint256 _auctionId) external {
    _cancelAuction(_auctionId);
  }

  /// @dev Reject all Ether from being sent here
  function() external payable {
    revert();
  }

  // Internal functions

  /// @dev Transfers an NFT owned by this contract to another address.
  /// Returns true if the transfer succeeds.
  /// @param _nft - The address of the NFT.
  /// @param _receiver - Address to transfer NFT to.
  /// @param _tokenId - ID of token to transfer.
  function _transfer(address _nft, address _receiver, uint256 _tokenId) internal {
    ERC721 nftContract = ERC721(_nft);

    // it will throw if transfer fails
    nftContract.transfer(_receiver, _tokenId);
  }

  /// @dev Cancels an auction unconditionally.
  function _cancelAuction(uint256 _auctionId)
    internal
    statusIs(AuctionStatus.Active, _auctionId)
    onlySeller(_auctionId)
  {
    Auction storage auction = auctions[_auctionId];
    auction.cancelled = true;

    _removeAuction(auction.nftAddress, auction.tokenId);
    _transfer(auction.nftAddress, auction.seller, auction.tokenId);

    AuctionCancelled(_auctionId, auction.nftAddress, auction.tokenId);
  }

  /// @dev Removes an auction from mapping
  function _removeAuction(address _nft, uint256 _tokenId) internal {
    delete nftToTokenIdToAuctionId[_nft][_tokenId];
  }

  function _getAuctionStatus(uint256 _auctionId)
    internal
    view
    returns (AuctionStatus)
  {
    Auction storage auction = auctions[_auctionId];

    if (auction.cancelled) {
      return AuctionStatus.Cancelled;
    }
    else if (auction.startBlock + auction.duration < block.number) {
      return AuctionStatus.Completed;
    }
    else {
      return AuctionStatus.Active;
    }
  }

  // Modifiers

  modifier onlySeller(uint256 _auctionId) {
    Auction memory auction = auctions[_auctionId];
    require(msg.sender == auction.seller);
    _;
  }

  modifier statusIs(AuctionStatus expectedStatus, uint256 _auctionId) {
    require(expectedStatus == _getAuctionStatus(_auctionId));
    _;
  }
}
