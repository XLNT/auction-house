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
    for (let i = 0; i < this.auctionsLength; i++) {
      promises.push(this.importAuction(i, currentBlock));
    }
    this.auctions = await Promise.all(promises);
  }

  async importAuction(_id, currentBlock) {
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
    return {
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
  }

  render() {
    return (
      <div>
        <h1>Auctions ({this.auctionsLength.toString()} total)</h1>
        <ul>
          {this.auctions.map(auction => (
            <li key={auction.id.toString()}>
              <Link to={`/auction/${auction.id.toString()}`}>
                <b>Auction {auction.id.toString()}</b> selling NFT{" "}
                {auction.tokenId.toString()} from contract {auction.nftAddress}{" "}
                with current highest bid: {auction.highestBid.toString()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
