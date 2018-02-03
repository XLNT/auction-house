import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, observe, action, autorun, computed } from "mobx";
import BigNumber from "bignumber.js";

@inject("store")
@observer
export default class Auction extends Component {
  @observable auction;
  @observable highestBidder;
  @observable highestBid = new BigNumber(0);
  @observable currentAccountBid = new BigNumber(0);
  @observable bidIncrement = new BigNumber(0);

  async componentDidMount() {
    this.auction = await this.props.store.Auction.at(
      this.props.match.params.auctionUid
    );
    autorun(() => this.getAuctionData());
  }

  async getAuctionData() {
    const { currentBlock, currentAccount } = this.props.store;
    console.log("getAuctionData", currentBlock, currentAccount);
    this.bidIncrement = await this.auction.bidIncrement({}, currentBlock);
    this.highestBid = await this.auction.highestBid({}, currentBlock);
    this.highestBidder = await this.auction.highestBidder({}, currentBlock);
    this.currentAccountBid = await this.auction.getBid(
      currentAccount,
      {},
      currentBlock
    );
  }

  async placeBid(bigNumber) {
    const params = {
      from: this.props.store.currentAccount,
      value: bigNumber
    };
    const receipt = await this.auction.bid(params);
  }

  @computed
  get nextMinBid() {
    return this.highestBid
      .plus(this.bidIncrement)
      .minus(this.currentAccountBid);
  }

  render() {
    if (!this.auction) return <div>Loading...</div>;
    return (
      <div>
        <h1>Auction {this.auction.address}</h1>
        <div>Highest bid: {this.highestBid.toString()}</div>
        <div>
          Highest bidder: {this.highestBidder ? this.highestBidder : "None"}
        </div>
        <div>Your bid: {this.currentAccountBid.toString()}</div>
        <button onClick={() => this.placeBid(this.nextMinBid)}>
          Place Bid!!
        </button>
      </div>
    );
  }
}
