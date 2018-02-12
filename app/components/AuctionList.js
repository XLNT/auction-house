import React, { Component } from "react";
import { action, autorun, observable, observe, runInAction, when } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";
import {
  Wrapper,
  Spacer,
  Divider,
  colors,
  LeftContainer,
  RightContainer,
  Button
} from "../styles";
import {
  Container,
  Status,
  StatusPulse,
  Gallery,
  Heading,
  Description,
  SellerInformation
} from "./auction/auction";
import CountDown from "./CountDown";
import test from "../images/test.png";

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
          },
          true // invoke immediately
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

  statusText(status) {
    if (status.equals(0)) return "Live";
    else if (status.equals(1)) return "Cancelled";
    else return "Completed";
  }

  statusColor(status) {
    if (status.equals(0)) return colors.green;
    else if (status.equals(1)) return colors.yellow;
    else return colors.blue;
  }

  render() {
    const auctionOfInterest = this.auctions[0];
    if (!auctionOfInterest) return null;
    console.log(this.auctionsLength, this.auctions);
    return (
      <Wrapper>
        Auction count: {this.auctionsLength.toString()},{" "}
        {JSON.stringify(this.auctions)}
      </Wrapper>
    );
  }
}
