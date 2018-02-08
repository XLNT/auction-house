var AuctionBase = artifacts.require("./AuctionBase.sol");

module.exports = function(deployer) {
  deployer.deploy(AuctionBase);
};
