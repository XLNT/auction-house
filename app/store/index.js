import {
  action,
  observable,
  computed,
  observe,
  when,
  extendObservable
} from "mobx";
import contract from "truffle-contract";
import { Curator } from "curator-contracts";
import { AuctionBase } from "auction-contracts";
import BigNumber from "bignumber.js";
import IPFS from "ipfs";
import { getEndDate } from "../utils";

export default class Store {
  @observable currentBlock = "latest";
  @observable currentAccount = null;
  @observable currentNetwork = null;
  @observable readOnlyAuctionBaseInstance = null;
  @observable writeOnlyAuctionBaseInstance = null;
  @observable curatorInstance = null;
  @observable auctions = [];
  @observable auctionsLength = new BigNumber(0);
  @observable windows = [];
  @observable topZ = 1;

  constructor(readOnlyWeb3, writeOnlyWeb3) {
    this.web3 = readOnlyWeb3;
    this.ipfsNode = new IPFS();
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 500); // Ugh ಠ_ಠ
    this.networkInterval = setInterval(() => this.setCurrentNetwork(), 500);
    this.blockInterval = setInterval(() => this.setCurrentBlock(), 1000);

    // Setup read only AuctionBase contract
    const AuctionBaseContract = contract(AuctionBase);
    AuctionBaseContract.setProvider(readOnlyWeb3.currentProvider);
    AuctionBaseContract.deployed()
      .then(instance => {
        this.readOnlyAuctionBaseInstance = instance;
        return instance;
      })
      .catch(err => {
        console.log(err);
      });

    // Setup write only AuctionBase contract
    AuctionBaseContract.setProvider(writeOnlyWeb3.currentProvider);
    AuctionBaseContract.deployed()
      .then(instance => {
        this.writeOnlyAuctionBaseInstance = instance;
        return instance;
      })
      .catch(err => {
        console.log(err);
      });

    // Setup Curator contract
    const CuratorContract = contract(Curator);
    CuratorContract.setProvider(readOnlyWeb3.currentProvider);
    CuratorContract.deployed()
      .then(instance => {
        this.curatorInstance = instance;
        return instance;
      })
      .catch(err => {
        console.log(err);
      });

    // Watch isReady
    when(
      () => this.isReady,
      () => {
        this.setWatchers();
      }
    );
  }

  @computed
  get isReady() {
    return (
      this.currentAccount &&
      this.currentBlock &&
      this.curatorInstance &&
      this.readOnlyAuctionBaseInstance
    );
  }

  @action
  addWindow(item) {
    const isFirstWindow = this.windows.length === 0;
    const key = item.key;
    let existingWindow = this.windows.filter(obj => obj.key === key)[0];
    if (existingWindow) {
      this.focusWindow(key);
    } else {
      const newParams = {
        top: isFirstWindow ? 0 : Math.random() * 200,
        left: isFirstWindow ? 0 : Math.random() * 300
      };
      this.windows.push(Object.assign(item, newParams));
      this.focusWindow(key);
    }
  }

  @action
  focusWindow(key) {
    const newZ = this.topZ + 1;
    const existingWindow = this.windows.filter(obj => obj.key === key)[0];
    extendObservable(existingWindow, { z: newZ });
    this.topZ = newZ;
  }

  @action
  removeWindow(key) {
    this.windows = this.windows.filter(obj => obj.key !== key);
  }

  // Getters
  async getAuctionsLength() {
    this.auctionsLength = await this.readOnlyAuctionBaseInstance.getAuctionsCount(
      {},
      this.currentBlock
    );
  }

  async getAuctions() {
    if (this.auctionsLength === 0) return false;
    const promises = [];
    for (let i = 0; i < this.auctionsLength; i++) {
      promises.push(this.importAuction(i));
    }
    this.auctions = await Promise.all(promises);
  }

  auctionById(id) {
    return this.auctions.filter(auction => auction.id.equals(id))[0];
  }

  async importAuction(_id) {
    const [
      id,
      nftAddress,
      tokenId,
      seller,
      bidIncrement,
      duration,
      startedAt,
      startBlock,
      status,
      highestBid,
      highestBidder
    ] = await this.readOnlyAuctionBaseInstance.getAuction(
      _id,
      this.currentBlock
    );
    const nftData = await this.curatorInstance.assetData(
      tokenId,
      this.currentBlock
    );
    const data = await this.ipfsNode.object.data(nftData);
    const jsonData = JSON.parse(data.toString());
    const endDate = getEndDate(startedAt.toString(), duration.toNumber() * 14);
    return {
      id,
      nftAddress,
      tokenId,
      seller,
      bidIncrement,
      duration,
      startedAt,
      startBlock,
      status,
      highestBid,
      highestBidder,
      endDate,
      nftMetadata: jsonData
    };
  }

  // Setters
  setWatchers() {
    this.blockWatcher = observe(
      this,
      "currentBlock",
      () => {
        this.getAuctionsLength();
      },
      true
    );

    this.auctionsLengthWatcher = observe(
      this,
      "auctionsLength",
      () => {
        this.getAuctions();
      },
      true
    );
  }

  setCurrentAccount() {
    this.web3.eth.getAccounts(
      action((error, accounts) => {
        this.currentAccount = accounts[0];
        if (error) {
          console.log("Error", "setCurrentAccount", error);
        }
      })
    );
  }

  setCurrentNetwork() {
    this.web3.version.getNetwork((error, network) => {
      this.currentNetwork = network;
      if (error) {
        console.log("Error", "setCurrentNetwork", error);
      }
    });
  }

  setCurrentBlock() {
    this.web3.eth.getBlock(
      "latest",
      action((error, result) => {
        if (result.number !== this.currentBlock) {
          this.currentBlock = result.number;
        }
        if (error) {
          console.log("Error", "setCurrentBlock", error);
        }
      })
    );
  }
}
