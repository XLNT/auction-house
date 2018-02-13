import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Spacer,
  Divider,
  colors,
  Button,
  basePadding,
  lighten
} from "../styles";
import CountDown from "./CountDown";
import styled, { keyframes } from "react-emotion";

function pulseBuilder() {
  const pulse = keyframes`
    0% { -webkit-transform: scale(0) }
    100% {
      -webkit-transform: scale(0.75);
      opacity: 50;
    }
  `;
  return pulse;
}

const Status = styled("div")`
  font-size: 15px;
  font-weight: 400;
  text-transform: uppercase;
  display: inline-block;
  color: ${props => (props.color ? props.color : colors.black)};
`;

const StatusPulse = styled("div")`
  background-color: ${props => (props.color ? props.color : colors.black)};
  width: 6px;
  height: 6px;
  display: inline-block;
  margin-bottom 2px;
  border-radius: 100%;
  animation:  ${props =>
    props.active && `${pulseBuilder()} 1.5s infinite ease-in-out`};
`;

const Heading = styled("span")`
  font-size: 40px;
  font-weight: 600;
  display: inline-block;
`;

const SellerInformation = styled("div")`
  font-weight: 100;
  font-size: 14px;
`;

const Description = styled("div")`
  font-size: 18px;
  font-weight: 300;
`;

@inject("store")
@inject("auctionStore")
@observer
export default class AuctionInfo extends Component {
  statusColor(status) {
    if (status.equals(0)) return colors.green;
    else if (status.equals(1)) return colors.yellow;
    else return colors.blue;
  }

  render() {
    const { auction, statusText } = this.props.auctionStore;
    return (
      <div>
        <Status color={this.statusColor(auction.status)}>
          {statusText}{" "}
          <StatusPulse
            color={this.statusColor(auction.status)}
            active={statusText == "Live"}
          />
        </Status>
        <Spacer size={0.5} />

        <div>Auction #{auction.id.toString()}</div>
        <Heading>{auction.nftMetadata.name}</Heading>
        <SellerInformation>
          Created by {auction.nftMetadata.creator}
        </SellerInformation>
        <Spacer size={0.5} />

        <Description>
          <div>
            NFT: {auction.tokenId.toString()}@{auction.nftAddress}
          </div>
          <div>{auction.nftMetadata.decription}</div>
        </Description>
      </div>
    );
  }
}
