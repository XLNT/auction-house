import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { action, autorun, computed, observable, observe, when } from "mobx";
import BigNumber from "bignumber.js";
import AuctionBidBox from "./AuctionBidBox";
import {
  Wrapper,
  Button,
  Badge,
  Spacer,
  LeftContainer,
  RightContainer,
  colors,
  basePadding,
  fontSizes,
  darken
} from "../styles";
import test from "../images/Miriam.jpg";
import {
  Container,
  Status,
  StatusPulse,
  Gallery,
  Heading,
  Description,
  SellerInformation
} from "./auction/auction";

@inject("store")
@observer
export default class AuctionBidWindow extends Component {
  @observable currentAccountBid = new BigNumber(0);
  @observable hideOwnBidWarning = false;

  componentWillUnmount() {
    if (this.auctionBaseWatcher) {
      this.auctionBaseWatcher();
    }

    if (this.blockWatcher) {
      this.blockWatcher();
    }
  }

  @action
  async getCurrentAccountBid(_id) {
    const {
      auctionBaseInstance,
      currentAccount,
      currentBlock
    } = this.props.store;
    if (!currentAccount) {
      this.currentAccountBid = new BigNumber(0);
      return false;
    }
    this.currentAccountBid = await auctionBaseInstance.getBid(
      _id,
      currentAccount,
      {},
      currentBlock
    );
  }

  @action
  async placeBid(bigNumber) {
    const { auctionBaseInstance } = this.props.store;
    const adjustedBid = bigNumber.minus(this.currentAccountBid);
    const params = {
      from: this.props.store.currentAccount,
      value: adjustedBid
    };
    const receipt = await auctionBaseInstance.bid(this.auction.id, params);
    this.hideOwnBidWarning = false;
  }

  @action
  async withdrawBalance() {
    const { auctionBaseInstance } = this.props.store;
    const params = {
      from: this.props.store.currentAccount
    };
    const receipt = await auctionBaseInstance.withdrawBalance(
      this.auction.id,
      params
    );
  }

  @computed
  get statusText() {
    const { status } = this.auction;
    if (status.equals(0)) return "Live";
    else if (status.equals(1)) return "Cancelled";
    else return "Completed";
  }

  @computed
  get statusColor() {
    const { status } = this.auction;
    if (status.equals(0)) return colors.green;
    else if (status.equals(1)) return colors.yellow;
    else return colors.blue;
  }

  @computed
  get auction() {
    return this.props.store.auctionById(this.props.auctionId);
  }

  render() {
    console.log("Bid", this.auction);
    if (!this.auction) {
      return <div>Loading...</div>;
    }
    const {
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
      endDate
    } = this.auction;

    return (
      <div>
        <AuctionBidBox
          highestBid={highestBid}
          highestBidder={highestBidder}
          bidIncrement={bidIncrement}
          currentAccountBid={this.currentAccountBid}
          statusText={this.statusText}
          bidCallback={bid => this.placeBid(bid)}
          endDate={endDate}
          withdrawCallback={() => this.withdrawBalance()}
        />
      </div>
    );
  }
}
