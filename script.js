const Web3 = require("web3");
const contract = require("truffle-contract");
const repl = require('repl');

const AuctionContract = require("./build/contracts/AuctionFactory.json");
const HillCoreContract = require("./build/contracts/HillCore.json");

global.web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:7545")
);

global.accounts = global.web3.eth.accounts;
global.acct0 = global.accounts[0];
global.acct1 = global.accounts[1];

const AuctionFactory = contract(AuctionContract);
AuctionFactory.setProvider(global.web3.currentProvider);

const HillCore = contract(HillCoreContract);
HillCore.setProvider(global.web3.currentProvider);

Promise.all([
  AuctionFactory.deployed(),
  HillCore.deployed()
]).then(([_auctionFactory, _hillCore]) => {
  global.auctionFactory = _auctionFactory;
  global.hillCore = _hillCore;

  global.hillCore.unpause({from: acct0});
}).then((unpauseResponse) => {
  global.hillCore.createPromoHill(1, 1, 1, acct1, {from: acct0, gas: 1000000})
}).then((promoHill) => {
  repl.start({});
}).catch((error) => {
  console.log("ERROR : ", error);
});
