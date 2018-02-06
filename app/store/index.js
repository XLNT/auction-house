import { action, observable } from "mobx";
import contract from "truffle-contract";
import AuctionBaseContract from "../../build/contracts/AuctionBase.json";
import HillCoreContract from "../../build/contracts/HillCore.json";

export default class Store {
  @observable currentAccount = null;
  @observable currentBlock = "latest";

  constructor(web3) {
    this.web3 = web3;
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 500); // Ugh ಠ_ಠ
    this.blockInterval = setInterval(() => this.setCurrentBlock(), 1000);
    // Setup AuctionBase contract
    this.AuctionBase = contract(AuctionBaseContract);
    this.AuctionBase.setProvider(this.web3.currentProvider);

    // Setup CryptoHills contract
    this.HillCore = contract(HillCoreContract);
    this.HillCore.setProvider(this.web3.currentProvider);
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
