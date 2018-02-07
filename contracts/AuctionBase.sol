pragma solidity ^0.4.18;

import "./erc721/ERC721.sol";
import "./utils/Pausable.sol";

/// @title AuctionBase
/// @dev Contains models, variables, and internal methods for the auction.
contract AuctionBase is Pausable {

  struct Auction {
    // static
    address nftAddress; // NFT address
    uint256 tokenId; // ID of the nft
    address seller; // Current owner of NFT
    uint128 bidIncrement; // Minimum bid increment (in Wei)
    uint64 duration; // Duration (in seconds) of auction
    uint64 startedAt; // Time when auction started (0 if auction is concluded)

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
    uint64 duration,
    uint64 startedAt,
    bool isActive,
    uint256 highestBid,
    address highestBidder
  ) {
    Auction storage auction = auctions[_id];
    return (
      _id,
      auction.nftAddress,
      auction.tokenId,
      auction.seller,
      auction.bidIncrement,
      auction.duration,
      auction.startedAt,
      _isActive(auction),
      auction.highestBid,
      auction.highestBidder
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

  /// @dev Creates and begins a new auction.
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

    // Put nft in escrow
    nftContract.transferFrom(msg.sender, this, _tokenId);

    // Init auction
    Auction memory _auction = Auction({
      nftAddress: _nftAddress,
      tokenId: _tokenId,
      seller: msg.sender,
      bidIncrement: uint128(_bidIncrement),
      duration: uint64(_duration),
      startedAt: uint64(now),
      highestBid: 0,
      highestBidder: 0,
      cancelled: false
    });

    uint256 newAuctionId = auctions.push(_auction) - 1;

    // Add auction index to nftToTokenIdToAuctionId mapping
    nftToTokenIdToAuctionId[_nftAddress][_tokenId] = newAuctionId;

    // Emit AuctionCreated event
    AuctionCreated(newAuctionId, _nftAddress, _tokenId);
  }

  function bid(uint256 _id) external payable whenNotPaused {
    require(msg.value > 0);

    // Get auction from _id
    Auction storage auction = auctions[_id];

    require(_isActive(auction));

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
    BidCreated(_id, auction.nftAddress, auction.tokenId, msg.sender, newBid);
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
  function _cancelAuction(uint256 _id) internal {
    Auction storage auction = auctions[_id];
    require(_isActive(auction));
    require(msg.sender == auction.seller);
    auction.cancelled = true;
    _removeAuction(auction.nftAddress, auction.tokenId);
    _transfer(auction.nftAddress, auction.seller, auction.tokenId);
    AuctionCancelled(_id, auction.nftAddress, auction.tokenId);
  }

  /// @dev Removes an auction from mapping
  function _removeAuction(address _nft, uint256 _tokenId) internal {
    delete nftToTokenIdToAuctionId[_nft][_tokenId];
  }

  /// @dev Returns true if the NFT is on auction.
  /// @param _auction - Auction to check.
  function _isActive(Auction storage _auction) internal view returns (bool) {
    return (_auction.startedAt > 0 && !_auction.cancelled && _getAuctionEndAt(_auction) <= now);
  }

  function _isEnded(Auction storage _auction) internal view returns (bool) {
    return (_getAuctionEndAt(_auction) > now);
  }

  function _isWithdrawable(Auction storage _auction) internal view returns (bool) {
    return (_auction.cancelled || _isEnded(_auction));
  }

  function _getAuctionEndAt(Auction storage _auction) internal view returns (uint64) {
    return (_auction.startedAt + _auction.duration);
  }

  /// @dev Reject all Ether from being sent here
  function() external payable {
    revert();
  }
}
