import React, { Component } from "react";
import {
  action,
  autorun,
  computed,
  observable,
  observe,
  runInAction,
  when
} from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";
import {
  Spacer,
  Divider,
  colors,
  Button,
  basePadding,
  lighten
} from "../styles";
import {
  Status,
  StatusPulse,
  Heading,
  Description,
  SellerInformation
} from "./auction/auction";
import CountDown from "./CountDown";
import styled from "react-emotion";

@inject("store")
@inject("auctionStore")
@observer
export default class AuctionInfo extends Component {
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
    const { auction } = this.props.auctionStore;
    return (
      <div>
        <Status>
          {this.statusText(auction.status)}{" "}
          <StatusPulse
            active={this.statusText(auction.status) == "Live"}
            color={this.statusColor(auction.status)}
          />
        </Status>
        <Spacer size={0.5} />

        <Heading>Auction #{auction.id.toString()}</Heading>
        <SellerInformation>by {auction.seller}</SellerInformation>
        <Spacer size={0.5} />

        <Description>
          NFT: {auction.tokenId.toString()}@{auction.nftAddress}
        </Description>
      </div>
    );
  }
}
