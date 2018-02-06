import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, observe, action, autorun, computed } from "mobx";
import BigNumber from "bignumber.js";

// TODO use AuctionBase instead of separate Auction contracts

@inject("store")
@observer
export default class Auction extends Component {
  @observable auction;
  @observable loadingAuction = true;
  @observable currentAccountBid = new BigNumber(0);

  async componentDidMount() {
    this.auctionBase = await this.props.store.AuctionBase.deployed();
    const { auctionId } = this.props.match.params;
    this.getAuction(auctionId);
    const bidWatcher = observe(this, "auction", change => {
      this.getCurrentAccountBid(auctionId);
    });
  }

  @action
  async getAuction(_id) {
    this.loadingAuction = true;
    const { currentBlock, currentAccount } = this.props.store;
    const [
      id,
      nftAddress,
      tokenId,
      seller,
      bidIncrement,
      duration,
      startedAt,
      highestBid,
      highestBidder
    ] = await this.auctionBase.getAuction(_id, currentBlock);
    this.auction = {
      id,
      nftAddress,
      tokenId,
      seller,
      bidIncrement,
      duration,
      startedAt,
      highestBid,
      highestBidder
    };
    this.loadingAuction = false;
  }

  @action
  async getCurrentAccountBid(_id) {
    const { currentBlock, currentAccount } = this.props.store;
    this.currentAccountBid = await this.auctionBase.getBid(_id, currentBlock);
    console.log("currentAccount", this.currentAccountBid);
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
    if (this.loadingAuction) return <div>Loading...</div>;
    const {
      id,
      nftAddress,
      tokenId,
      seller,
      bidIncrement,
      duration,
      startedAt,
      highestBid,
      highestBidder
    } = this.auction;
    return (
      <div>
        <h1>Auction {id.toString()}</h1>
        <div>NFT address: {nftAddress}</div>
        <div>Token ID: {tokenId.toString()}</div>
        <div>Seller: {seller}</div>
        <div>Bid increment (in Wei): {bidIncrement.toString()}</div>
        <div>Duration: {duration.toString()}</div>
        <div>Started at: {startedAt.toString()}</div>
        <div>Highest bid: {highestBid.toString()}</div>
        <div>Highest bidder: {highestBidder ? highestBidder : "None"}</div>
        <div>Your bid: {this.currentAccountBid.toString()}</div>
        <button onClick={() => this.placeBid(this.nextMinBid)}>
          Place Bid!!
        </button>
      </div>
    );
  }
}
