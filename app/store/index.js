import { action, observable, computed } from "mobx";
import contract from "truffle-contract";
import { Curator } from "curator-contracts";
import { AuctionBase } from "auction-contracts";
import IPFS from "ipfs";

export default class Store {
  @observable currentBlock = "latest";
  @observable currentAccount = null;
  @observable currentNetwork = null;
  @observable auctionBaseInstance = null;
  @observable curatorInstance = null;

  constructor(web3) {
    this.web3 = web3;
    this.ipfsNode = new IPFS();
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 500); // Ugh ಠ_ಠ
    this.networkInterval = setInterval(() => this.setCurrentNetwork(), 500);
    this.blockInterval = setInterval(() => this.setCurrentBlock(), 1000);

    // Setup AuctionBase contract
    const AuctionBaseContract = contract(AuctionBase);
    AuctionBaseContract.setProvider(this.web3.currentProvider);
    AuctionBaseContract.deployed().then(instance => {
      this.auctionBaseInstance = instance;
    });

    // Setup Curator contract
    const CuratorContract = contract(Curator);
    CuratorContract.setProvider(this.web3.currentProvider);
    CuratorContract.deployed().then(instance => {
      this.curatorInstance = instance;
    });
  }

  @computed
  get isReady() {
    return (
      this.currentAccount &&
      this.currentBlock &&
      this.curatorInstance &&
      this.auctionBaseInstance
    );
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
    });
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
