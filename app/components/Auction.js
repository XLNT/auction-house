import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, observe, action, autorun } from "mobx";
import BigNumber from "bignumber.js";
import AuctionContract from "../../build/contracts/Auction.json";

@inject("store")
@observer
export default class Auction extends Component {
  @observable highestBidder;
  @observable highestBid = new BigNumber(0);
  @observable currentAccountBid = new BigNumber(0);
  @observable bidIncrement = new BigNumber(0);

  constructor(props) {
    super(props);
    const { auctionUid } = props.match.params;
    this.auctionInstance = props.store.web3.eth
      .contract(AuctionContract.abi)
      .at(auctionUid.toLowerCase());
  }

  componentDidMount() {
    this.getAuctionData();
    const watcher = observe(this.props.store, "currentBlock", change =>
      this.getAuctionData()
    );
  }

  getAuctionData() {
    this.getBidIncrement();
    this.getHighestBid();
    this.getHighestBidder();
    this.getCurrentAccountBid();
  }

  getBidIncrement() {
    this.auctionInstance.bidIncrement(
      {},
      this.props.store.currentBlock,
      action((err, res) => {
        this.bidIncrement = res;
      })
    );
  }

  getHighestBid() {
    this.auctionInstance.highestBid(
      {},
      this.props.store.currentBlock,
      action((err, res) => {
        this.highestBid = res;
      })
    );
  }

  getHighestBidder() {
    this.auctionInstance.highestBidder(
      {},
      this.props.store.currentBlock,
      action((err, res) => {
        this.highestBidder = res;
      })
    );
  }

  getCurrentAccountBid() {
    if (!this.props.store.currentAccount) return false;
    this.auctionInstance.getBid(
      this.props.store.currentAccount,
      {},
      this.props.store.currentBlock,
      action((err, result) => {
        this.currentAccountBid = result;
      })
    );
  }

  placeBid(bigNumber) {
    const params = {
      from: this.props.store.currentAccount,
      value: bigNumber
    };
    this.auctionInstance.bid(params, (err, result) => {
      console.log(result);
    });
  }

  render() {
    const nextBid = this.highestBid
      .plus(this.bidIncrement)
      .minus(this.currentAccountBid);
    console.log(nextBid);
    return (
      <div>
        <h1>Auction {this.auctionInstance.address}</h1>
        <div>Highest bid: {this.highestBid.toString()}</div>
        <div>
          Highest bidder: {this.highestBidder ? this.highestBidder : "None"}
        </div>
        <div>Your bid: {this.currentAccountBid.toString()}</div>
        <button onClick={() => this.placeBid(nextBid)}>Place Bid!!</button>
      </div>
    );
  }
}
