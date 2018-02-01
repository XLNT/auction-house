pragma solidity ^0.4.18;

contract Auction {
  // static
  address public owner;
  uint public bidIncrement;

  // state
  mapping (address => uint256) public allowed;
  uint public highestBid;
  address public highestBidder;

  // events
  event BidEvent(address bidder, uint bid);

  // init
  function Auction(address _owner, uint _bidIncrement) public {
    owner = _owner;
    bidIncrement = _bidIncrement;
  }

  // methods
  function bid() public payable returns (bool success) {
    require(msg.value > 0);
    uint newBid;
    if (highestBidder == msg.sender) {
      newBid = highestBid + msg.value;
    } else {
      newBid = allowed[msg.sender] + msg.value;
    }
    require(newBid > highestBid);
    if (highestBidder != msg.sender) {
      allowed[highestBidder] = highestBid;
      allowed[msg.sender] = 0;
    }
    highestBidder = msg.sender;
    highestBid = newBid;
    BidEvent(msg.sender, newBid);
    return true;
  }

  function getBid(address bidder) public view returns (uint) {
    if (highestBidder == bidder) return highestBid;
    return allowed[bidder];
  }

  function withdraw() public returns (bool success) {
    require(allowed[msg.sender] > 0);
    uint toWithdraw = allowed[msg.sender];
    allowed[msg.sender] = 0;
    msg.sender.transfer(toWithdraw);
    return true;
  }

}
