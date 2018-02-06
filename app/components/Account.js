import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, observe, action, autorun, computed } from "mobx";
import BigNumber from "bignumber.js";

@inject("store")
@observer
export default class Account extends Component {
  @observable cryptoHills = [];
  @observable cryptoHillsBalance = new BigNumber(0);

  async componentDidMount() {
    this.cryptoHillsInstance = await this.props.store.CryptoHills.deployed();
    this.getCryptoHillsForCurrentAccount();
    const watcher = observe(this.props.store, "currentBlock", change => {
      this.getCryptoHillsForCurrentAccount();
    });
  }

  async getCryptoHillsForCurrentAccount() {
    const { currentAccount, currentBlock } = this.props.store;
    this.cryptoHillsBalance = await this.cryptoHillsInstance.balanceOf(
      currentAccount,
      currentBlock
    );

    const [
      elevation,
      latitude,
      longitude
    ] = await this.cryptoHillsInstance.getHill(1, currentBlock);
    console.log(
      "HILL",
      elevation.toString(),
      latitude.toString(),
      longitude.toString()
    );
  }

  render() {
    const { currentAccount } = this.props.store;
    return (
      <div>
        <h1>Account {currentAccount}</h1>
        <div>
          Crypto Hills Balance: {this.cryptoHillsBalance.toString()} Hills
        </div>
      </div>
    );
  }
}
