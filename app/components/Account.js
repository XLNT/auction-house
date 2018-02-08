import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { action, autorun, computed, observable, observe, when } from "mobx";
import BigNumber from "bignumber.js";

@inject("store")
@observer
export default class Account extends Component {
  @observable cryptoHills = [];
  @observable loadingHills = false;
  @observable cryptoHillsBalance = new BigNumber(0);

  async componentDidMount() {
    this.auction = await this.props.store.AuctionBase.deployed();
    window.s = this;
    this.hillCoreWatcher = when(
      () => this.props.store.hillCoreInstance,
      () => {
        this.blockWatcher = observe(
          this.props.store,
          "currentBlock",
          change => {
            this.getCryptoHillsBalance();
          }
        );
      }
    );

    this.balanceWatcher = observe(this, "cryptoHillsBalance", change => {
      this.getCryptoHills();
    });
  }

  componentWillUnmount() {
    if (this.hillCoreWatcher) {
      this.hillCoreWatcher();
    }

    if (this.blockWatcher) {
      this.blockWatcher();
    }

    if (this.balanceWatcher) {
      this.balanceWatcher();
    }
  }

  @action
  async getCryptoHills() {
    const { currentAccount, currentBlock, hillCoreInstance } = this.props.store;
    this.loadingHills = true;
    this.cryptoHills = [];
    if (!currentAccount || this.cryptoHillsBalance == 0) return false;

    const assets = await hillCoreInstance.assetsOf(
      currentAccount,
      currentBlock
    );

    const promises = assets.map(this.importCryptoHill.bind(this));

    this.cryptoHills = await Promise.all(promises);
  }

  async getCryptoHillsBalance() {
    const { currentAccount, currentBlock, hillCoreInstance } = this.props.store;
    if (!currentAccount) return false;
    this.cryptoHillsBalance = await hillCoreInstance.assetCount(
      currentAccount,
      currentBlock
    );
  }

  async importCryptoHill(id) {
    const { hillCoreInstance, currentBlock } = this.props.store;
    const hillData = await hillCoreInstance.assetData(id, currentBlock);
    return { id, data: hillData };
  }

  approveTransfer(id, currentAccount) {
    const { hillCoreInstance } = this.props.store;
    hillCoreInstance
      .approve(this.auction.address, id, {
        from: currentAccount
      })
      .then(res => {
        console.log(res);
      });
  }

  createAuction(id, currentAccount) {
    const { hillCoreInstance, web3 } = this.props.store;
    const bidIncrement = web3.toWei(0.1, "ether");
    this.auction
      .createAuction(hillCoreInstance.address, id, bidIncrement, 100000000000, {
        from: currentAccount
      })
      .then(res => {
        console.log(res);
      });
  }

  render() {
    const { currentAccount } = this.props.store;
    return (
      <div>
        <h1>Account {currentAccount}</h1>
        <div>
          Crypto Hills Balance: {this.cryptoHillsBalance.toString()} Hills
        </div>
        <ul>
          {this.cryptoHills.map(({ id, data }) => (
            <li key={id.toString()}>
              ID: {id.toString()} data: {data}
              <button onClick={() => this.approveTransfer(id, currentAccount)}>
                Approve Transfer
              </button>
              <button onClick={() => this.createAuction(id, currentAccount)}>
                Create Auction
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
