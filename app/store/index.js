import { action, observable, computed } from "mobx";
import contract from "truffle-contract";
import { Curator } from "curator-contracts";
import { AuctionBase } from "auction-contracts";
import IPFS from "ipfs";

export default class Store {
  @observable currentBlock = "latest";
  @observable currentAccount = null;
  @observable currentNetwork = null;
  @observable readOnlyAuctionBaseInstance = null;
  @observable writeOnlyAuctionBaseInstance = null;
  @observable curatorInstance = null;

  constructor(readOnlyWeb3, writeOnlyWeb3) {
    this.web3 = readOnlyWeb3;
    this.ipfsNode = new IPFS();
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 500); // Ugh ಠ_ಠ
    this.networkInterval = setInterval(() => this.setCurrentNetwork(), 500);
    this.blockInterval = setInterval(() => this.setCurrentBlock(), 1000);

    // Setup read only AuctionBase contract
    const AuctionBaseContract = contract(AuctionBase);
    AuctionBaseContract.setProvider(readOnlyWeb3.currentProvider);
    AuctionBaseContract.deployed().then(instance => {
      this.readOnlyAuctionBaseInstance = instance;
    });

    // Setup write only AuctionBase contract
    AuctionBaseContract.setProvider(writeOnlyWeb3.currentProvider);
    AuctionBaseContract.deployed().then(instance => {
      this.writeOnlyAuctionBaseInstance = instance;
    });

    // Setup Curator contract
    const CuratorContract = contract(Curator);
    CuratorContract.setProvider(readOnlyWeb3.currentProvider);
    CuratorContract.deployed().then(instance => {
      this.curatorInstance = instance;
    });

    window.s = this;
  }

  @computed
  get isReady() {
    return (
      this.currentAccount &&
      this.currentBlock &&
      this.curatorInstance &&
      this.readOnlyAuctionBaseInstance &&
      this.writeOnlyAuctionBaseInstance
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
    this.web3.version.getNetwork((error, network) => {
      this.currentNetwork = network;
    });
  }

  setCurrentBlock() {
    this.web3.eth.getBlock(
      "latest",
      action((error, result) => {
        if (result.number !== this.currentBlock) {
          this.currentBlock = result.number;
        }
      })
    );
  }
}
