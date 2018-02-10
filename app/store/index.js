import { action, observable } from "mobx";
import contract from "truffle-contract";
import { AuctionBase, HillCore } from "../contracts";

export default class Store {
  @observable currentBlock = "latest";
  @observable currentAccount = null;
  @observable currentNetwork = null;
  @observable auctionBaseInstance = null;
  @observable hillCoreInstance = null;

  constructor(web3) {
    this.web3 = web3;
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 500); // Ugh ಠ_ಠ
    this.networkInterval = setInterval(() => this.setCurrentNetwork(), 500);
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
  }

  setCurrentAccount() {
    this.web3.eth.getAccounts(
      action((error, accounts) => {
        this.currentAccount = accounts[0];
      })
    );
  }

  setCurrentNetwork() {
    web3.version.getNetwork((error, network) => {
      this.currentNetwork = network;
    })
  }

  setCurrentBlock() {
    this.web3.eth.getBlock(
      "latest",
      action((error, result) => {
        if (result.number != this.currentBlock) {
          this.currentBlock = result.number;
        }
      })
    );
  }
}
