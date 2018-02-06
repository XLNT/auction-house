import React, { Component } from "react";
import { action, observable, observe, autorun, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";

@inject("store")
@observer
export default class AuctionList extends Component {
  @observable auctions = [];
  @observable auctionsLength = new BigNumber(0);

  async componentDidMount() {
    this.auctionBase = await this.props.store.AuctionBase.deployed();
    autorun(() => this.getAuctionsLength());
    window.s = this;
    const watcher = observe(this, "auctionsLength", change => {
      this.getAuctions();
    });
  }

  async getAuctionsLength() {
    this.auctionsLength = await this.auctionBase.getAuctionsCount(
      {},
      this.props.store.currentBlock
    );
  }

  async getAuctions() {
    const { currentBlock, currentAccount } = this.props.store;
    if (this.auctionsLength == 0) return false;
    const promises = [];
    for (let i = 1; i <= this.auctionsLength; i++) {
      promises.push(
        this.auctionBase
          .getAuction(i, { from: currentAccount }, currentBlock)
          .then(res => {
            return res;
          })
      );
    }
    this.auctions = await Promise.all(promises);
  }

  async createAuction() {
    const bidIncrement = this.props.store.web3.toWei(0.1, "ether");
    const receipt = await this.auctionFactory.createAuction(bidIncrement, {
      from: this.props.store.currentAccount
    });
    console.log("New auction transaction", receipt);
  }

  render() {
    return (
      <div>
        <h1>Auctions ({this.auctionsLength.toString()} total)</h1>
        <ul>
          {this.auctions.map(auction => (
            <li key={auction}>
              <Link to={`/auction/${auction}`}>{auction}</Link>
            </li>
          ))}
        </ul>
        <button onClick={() => this.createAuction()}>Create Auction</button>
      </div>
    );
  }
}
