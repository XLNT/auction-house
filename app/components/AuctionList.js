import React, { Component } from "react";
import { action, autorun, observable, observe, runInAction, when } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";
import { Wrapper } from "../styles";

@inject("store")
@observer
export default class AuctionList extends Component {
  @observable auctions = [];
  @observable auctionsLength = new BigNumber(0);

  async componentDidMount() {
    const { auctionId } = this.props.match.params;
    this.auctionBaseWatcher = when(
      () => this.props.store.auctionBaseInstance,
      () => {
        this.getAuctionsLength();
        this.blockWatcher = observe(
          this.props.store,
          "currentBlock",
          change => {
            this.getAuctionsLength();
          }
        );
      }
    );

    this.auctionsLengthWatcher = observe(this, "auctionsLength", change => {
      this.getAuctions();
    });
  }

  componentWillUnmount() {
    if (this.auctionBaseWatcher) {
      this.auctionBaseWatcher();
    }

    if (this.auctionsLengthWatcher) {
      this.auctionsLengthWatcher();
    }

    if (this.blockWatcher) {
      this.blockWatcher();
    }
  }

  async getAuctionsLength() {
    const { auctionBaseInstance } = this.props.store;
    this.auctionsLength = await auctionBaseInstance.getAuctionsCount(
      {},
      this.props.store.currentBlock
    );
  }

  async getAuctions() {
    const {
      currentBlock,
      currentAccount,
      auctionBaseInstance
    } = this.props.store;
    if (this.auctionsLength == 0) return false;
    const promises = [];
    for (let i = 0; i < this.auctionsLength; i++) {
      promises.push(this.importAuction(i));
    }
    this.auctions = await Promise.all(promises);
  }

  async importAuction(_id) {
    const { currentBlock, auctionBaseInstance } = this.props.store;
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
    ] = await auctionBaseInstance.getAuction(_id, currentBlock);
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
      highestBidder
    };
  }

  render() {
    return (
      <Wrapper>
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
      </Wrapper>
    );
  }
}
