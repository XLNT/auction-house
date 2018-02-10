import { action, observable } from "mobx";
import contract from "truffle-contract";
import { AuctionBase, HillCore } from "../contracts";

export default class Store {
  @observable currentAccount = null;
  @observable currentBlock = "latest";
  @observable auctionBaseInstance = null;
  @observable hillCoreInstance = null;

  constructor(web3) {
    this.web3 = web3;
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 500); // Ugh ಠ_ಠ
    this.blockInterval = setInterval(() => this.setCurrentBlock(), 1000);
    // Setup AuctionBase contract
    const AuctionBaseContract = contract({
      abi: AuctionBase.abi
    });
    AuctionBaseContract.setProvider(this.web3.currentProvider);
    AuctionBaseContract.at(AuctionBase.address).then(instance => {
      this.auctionBaseInstance = instance;
    });

    // Setup CryptoHills contract
    const HillCoreContract = contract({
      abi: HillCore.abi
    });
    HillCoreContract.setProvider(this.web3.currentProvider);
    HillCoreContract.at(HillCore.address).then(instance => {
      this.hillCoreInstance = instance;
    });
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
