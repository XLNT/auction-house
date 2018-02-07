pragma solidity ^0.4.18;

import "./erc721/ERC721.sol";
import "./utils/Pausable.sol";

/// @title AuctionBase
/// @dev Contains models, variables, and internal methods for the auction.
contract AuctionBase is Pausable {

  // Ongoing: Auction is accepting bids and is not cancelled.
  // Cancelled: The seller cancelled the auction.
  // Concluded: Winning bid decided, but NFT and balance transfers are yet to happen.
  enum AuctionStatus { Ongoing, Cancelled, Concluded }

  struct Auction {
    // static
    address nftAddress; // NFT address
    uint256 tokenId; // ID of the nft
    address seller; // Current owner of NFT
    uint128 bidIncrement; // Minimum bid increment (in Wei)
    uint256 duration; // Block count for when the auction ends
    uint256 startBlock; // Block number when auction started (0 if auction is concluded)
    uint256 startedAt; // Approximate time for when the auction was started

    // state
    mapping (address => uint256) allowed; // Mapping of addresses to balance to withdraw
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

  // @dev Retrieve auctions count
  function getAuctionsCount() public view returns (uint256) {
    return auctions.length;
  }

  // @dev Returns auction info for an NFT on auction.
  // @param _id - auction index
  function getAuction(uint256 _id)
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
    address highestBidder,
    bool cancelled
  ) {
    Auction memory _auction = auctions[_id];
    AuctionStatus _status = _getAuctionStatus(_id);
    return (
      _id,
      _auction.nftAddress,
      _auction.tokenId,
      _auction.seller,
      _auction.bidIncrement,
      _auction.duration,
      _auction.startedAt,
      _auction.startBlock,
      _status,
      _auction.highestBid,
      _auction.highestBidder,
      _auction.cancelled
    );
  }

  // @dev Return bid for given auction ID and bidder
  function getBid(uint256 _id, address bidder) external view returns (uint256 bid) {
    Auction storage auction = auctions[_id];
    if (auction.highestBidder == bidder) return auction.highestBid;
    return auction.allowed[bidder];
  }

  // TODO
  // @dev Allow people to withdraw their balances
  // function withdrawBalance(uint256 _id) external {
  // }

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

    // Require duration to be at least a minute
    require(_duration >= 60);

    uint256 durationBlockCount = _duration / 14;

    // Put nft in escrow
    nftContract.transferFrom(msg.sender, this, _tokenId);

    // Init auction
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

    // Emit AuctionCreated event
    AuctionCreated(newAuctionId, _nftAddress, _tokenId);
  }

  function bid(uint256 _auctionId)
    external
    payable
    whenNotPaused
    isExpectedState(AuctionStatus.Ongoing, _auctionId)
  {
    require(msg.value > 0);

    // Get auction from _id
    Auction storage auction = auctions[_auctionId];

    // Set newBid
    uint256 newBid;
    if (auction.highestBidder == msg.sender) {
      newBid = auction.highestBid + msg.value;
    } else {
      newBid = auction.allowed[msg.sender] + msg.value;
    }

    // Require newBid be more than highestBid
    require(newBid > auction.highestBid);

    // Update allowed mapping
    if (auction.highestBidder != msg.sender) {
      auction.allowed[auction.highestBidder] = auction.highestBid;
      auction.allowed[msg.sender] = 0;
    }
    auction.highestBidder = msg.sender;
    auction.highestBid = newBid;

    // Emit BidCreated event
    BidCreated(_auctionId, auction.nftAddress, auction.tokenId, msg.sender, newBid);
  }

  function cancelAuction(address _nftAddress, uint256 _tokenId) external {
    uint256 auctionId = nftToTokenIdToAuctionId[_nftAddress][_tokenId];
    _cancelAuction(auctionId);
  }

  function cancelAuction(uint256 _id) external {
    _cancelAuction(_id);
  }

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
    isExpectedState(AuctionStatus.Ongoing, _auctionId)
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

  modifier onlySeller(uint256 _auctionId) {
    Auction memory auction = auctions[_auctionId];
    require(msg.sender == auction.seller);
    _;
  }

  modifier isExpectedState(AuctionStatus _expectedState, uint256 _auctionId) {
    require(_expectedState == _getAuctionStatus(_auctionId));
    _;
  }

  function _getAuctionStatus(uint256 _auctionId) internal view returns (AuctionStatus) {
    Auction storage auction = auctions[_auctionId];

    if (auction.cancelled) {
      return AuctionStatus.Cancelled;
    } else if (auction.startBlock + auction.duration < block.number) {
      return AuctionStatus.Concluded;
    } else {
      return AuctionStatus.Ongoing;
    }
  }

  /// @dev Reject all Ether from being sent here
  function() external payable {
    revert();
  }
}
