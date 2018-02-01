var Auction = artifacts.require("./Auction.sol");
var AuctionFactory = artifacts.require("./AuctionFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(Auction);
  deployer.deploy(AuctionFactory);
};
