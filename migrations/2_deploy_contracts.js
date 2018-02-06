var Auction = artifacts.require("./Auction.sol");
var AuctionFactory = artifacts.require("./AuctionFactory.sol");
var AuctionBase = artifacts.require("./AuctionBase.sol");
var HillCore = artifacts.require("./ERC721/HillCore.sol");

module.exports = function(deployer) {
  deployer.deploy(Auction);
  deployer.deploy(AuctionFactory);
  deployer.deploy(AuctionBase);
  deployer.deploy(HillCore);
};
