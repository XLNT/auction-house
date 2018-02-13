import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { computed } from "mobx";
import BigNumber from "bignumber.js";
import { Title, Content } from "./Auction";

@inject("auctionStore")
@inject("store")
@observer
export default class AuctionHighestBid extends Component {
  @computed
  get highestEthBid() {
    const { auction } = this.props.auctionStore;
    if (!auction) return new BigNumber(0);
    return this.props.store.web3.fromWei(auction.highestBid, "ether");
  }

  render() {
    return (
      <div>
        <Title>Highest Bid</Title>
        <Content>{this.highestEthBid.toNumber()} ETH</Content>
      </div>
    );
  }
}
