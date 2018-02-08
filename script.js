require("dotenv").config();
const Web3 = require("web3");
const contract = require("truffle-contract");
const repl = require("repl");

const ERC721Contract = require("./build/contracts/ERC721.json");
const AuctionBaseContract = require("./build/contracts/AuctionBase.json");

const host = process.env.RPC_HOST || "127.0.0.1";
const port = process.env.RPC_PORT || 7545;
global.web3 = new Web3(
  new Web3.providers.HttpProvider(`http://${host}:${port}`)
);

global.accounts = global.web3.eth.accounts;
global.acct0 = global.accounts[0];
global.acct1 = global.accounts[1];

const AuctionBase = contract(AuctionBaseContract);
AuctionBase.setProvider(global.web3.currentProvider);
AutionBase.deployed().then(_auctionBase => {
  global.auctionBase = _auctionBase;
  repl.start({});
});
