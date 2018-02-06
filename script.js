require("dotenv").config();
const Web3 = require("web3");
const contract = require("truffle-contract");
const repl = require("repl");

const ERC721Contract = require("./build/contracts/ERC721.json");
const AuctionBaseContract = require("./build/contracts/AuctionBase.json");
const HillCoreContract = require("./build/contracts/HillCore.json");

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

const HillCore = contract(HillCoreContract);
HillCore.setProvider(global.web3.currentProvider);

Promise.all([AuctionBase.deployed(), HillCore.deployed()])
  .then(([_auctionBase, _hillCore]) => {
    global.auctionBase = _auctionBase;
    global.hillCore = _hillCore;

    global.hillCore.unpause({ from: acct0 });
  })
  .then(unpauseResponse => {
    global.hillCore.createPromoHill(1, 1, 1, acct1, {
      from: acct0,
      gas: 1000000
    });
  })
  .then(promoHill => {
    repl.start({});
  })
  .catch(error => {
    console.log("ERROR : ", error);
  });
