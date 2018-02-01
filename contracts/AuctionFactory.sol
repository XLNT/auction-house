pragma solidity ^0.4.18;

import { Auction } from './Auction.sol';

contract AuctionFactory {
  address[] public auctions;

  event NewAuctionEvent(address auctionContract, address owner);

  function createAuction(uint bidIncrement) public returns (bool) {
    Auction newAuction = new Auction(msg.sender, bidIncrement);
    auctions.push(newAuction);

    NewAuctionEvent(newAuction, msg.sender);

    return true;
  }

  function getAuctions() public view returns (address[]) {
    return auctions;
  }
}
