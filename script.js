const Web3 = require("web3");
const AuctionContract = require("./build/contracts/AuctionFactory.json");

global.web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:7545")
);

global.auctionFactory = web3.eth
  .contract(AuctionContract.abi)
  .at("0x3d49d1ef2ade060a33c6e6aa213513a7ee9a6241".toLowerCase());

require("repl").start({});
