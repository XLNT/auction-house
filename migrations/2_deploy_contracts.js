var AuctionBase = artifacts.require("./AuctionBase.sol");
var HillCore = artifacts.require("./erc721/HillCore.sol");

module.exports = function(deployer) {
  deployer.deploy(AuctionBase);
  deployer.deploy(HillCore);
};
