import { action, observable } from "mobx";
import contract from "truffle-contract";
import AuctionContract from "../../build/contracts/Auction.json";
import AuctionFactoryContract from "../../build/contracts/AuctionFactory.json";
import CryptoHillsContract from "../../build/contracts/HillCore.json";

export default class Store {
  @observable currentAccount = null;
  @observable currentBlock = "latest";

  constructor(web3) {
    this.web3 = web3;
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 500); // Ugh ಠ_ಠ
    this.blockInterval = setInterval(() => this.setCurrentBlock(), 1000);
    // Setup Auction contract
    this.Auction = contract(AuctionContract);
    this.Auction.setProvider(this.web3.currentProvider);
    // Setup AuctionFactory contract
    this.AuctionFactory = contract(AuctionFactoryContract);
    this.AuctionFactory.setProvider(this.web3.currentProvider);

    // Setup CryptoHills contract
    this.CryptoHills = contract(CryptoHillsContract);
    this.CryptoHills.setProvider(this.web3.currentProvider);
    window.s = this;
  }

  setCurrentAccount() {
    this.web3.eth.getAccounts(
      action((error, accounts) => {
        this.currentAccount = accounts[0];
      })
    );
  }

  setCurrentBlock() {
    this.web3.eth.getBlock(
      "latest",
      action((err, res) => {
        if (res.number != this.currentBlock) {
          console.log(
            "Changing current block from",
            this.currentBlock,
            "to",
            res.number
          );
          this.currentBlock = res.number;
        }
      })
    );
  }
}
