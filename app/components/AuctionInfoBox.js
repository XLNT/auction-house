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
@observer
export default class AuctionInfoBox extends Component {
  @computed
  get auction() {
    return this.props.store.auctionById(this.props.auctionId);
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
    const { auction } = this;
    return (
      <div>
        {auction ? (
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
            <Divider padded={1.5} />
            <CountDown endDate={auction.endDate} />
            <Spacer />
            <Link to={`/auction/${auction.id.toString()}`}>
              <Button>View</Button>
            </Link>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}
