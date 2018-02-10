import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { action, autorun, computed, observable, observe, when } from "mobx";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "react-emotion";
import AuctionBidBox from "./AuctionBidBox";
import {
  Wrapper,
  Button,
  Badge,
  Spacer,
  colors,
  basePadding,
  fontSizes,
  darken
} from "../styles";
import test from "../images/test.png";

function pulseBuilder(degree) {
  const pulse = keyframes`
    0% { -webkit-transform: scale(0) }
    100% {
      -webkit-transform: scale(1.0);
      opacity: 0;
    }
  `;
  return pulse;
}

const Container = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: auto;
`;

const MetadataContainer = styled("div")`
  width: 65%;
  float: left;
`;

const BidContainer = styled("div")`
  width: 30%;
  float: right;
  padding-left: ${basePadding}px;
  padding-right: ${basePadding}px;
  background-color: ${colors.yellow};
`;

const Status = styled("div")`
  font-size: 15px;
  font-weight: 400;
  color: ${colors.grey};
  text-transform: uppercase;
  display: inline-block;
`;

const StatusPulse = styled("div")`
  background-color: ${colors.green};
  width: 8px;
  height: 8px;
  display: inline-block;
  margin-bottom 2px;
  border-radius: 100%;
  animation: ${pulseBuilder(10)} 1.5s infinite ease-in-out;
`;

const Heading = styled("span")`
  font-size: 40px;
  font-weight: 600;
  display: inline-block;
  color: white;
`;

const SellerInformation = styled("div")`
  font-weight: 100;
  font-size: 14px;
  color: white;
`;

const Description = styled("div")`
  font-size: 18px;
  font-weight: 300;
  color: white;
`;

const Gallery = styled("div")`
  width: 100%;
  height: 400px;
  background-color: ${colors.green};
  & img {
    height: 400px;
  }
`;

@inject("store")
@observer
export default class Auction extends Component {
  @observable auction = undefined;
  @observable loadingAuction = true;
  @observable currentAccountBid = new BigNumber(0);
  @observable hideOwnBidWarning = false;

  async componentDidMount() {
    const { auctionId } = this.props.match.params;
    this.auctionBaseWatcher = when(
      () => this.props.store.auctionBaseInstance,
      () => {
        this.blockWatcher = observe(
          this.props.store,
          "currentBlock",
          change => {
            this.getAuction(auctionId);
            this.getCurrentAccountBid(auctionId);
          }
        );
      }
    );
  }

  componentWillUnmount() {
    if (this.auctionBaseWatcher) {
      this.auctionBaseWatcher();
    }

    if (this.blockWatcher) {
      this.blockWatcher();
    }
  }

  @action
  async getAuction(_id) {
    this.loadingAuction = true;
    const { auctionBaseInstance, currentBlock } = this.props.store;
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
    ] = await auctionBaseInstance.getAuction(_id, {}, currentBlock);
    this.auction = {
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
    this.loadingAuction = false;
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

  @computed
  get StatusText() {
    const { status } = this.auction;
    if (status.equals(0)) return "Live";
    else if (status.equals(1)) return "Cancelled";
    else return "Completed";
  }

  @computed
  get StatusColor() {
    const { status } = this.auction;
    if (status.equals(0)) return colors.green;
    else if (status.equals(1)) return colors.yellow;
    else return colors.blue;
  }

  render() {
    if (this.loadingAuction)
      return <div style={{ color: colors.blue }}>Loading...</div>;
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
      highestBidder
    } = this.auction;

    return (
      <Wrapper>
        <Spacer size={3} />
        <Container>
          <MetadataContainer>
            <Status>
              <StatusPulse color={this.StatusColor} /> {this.StatusText}
            </Status>
            <Spacer size={0.5} />

            <Heading>Auction #{id.toString()}</Heading>
            <SellerInformation>by {seller}</SellerInformation>
            <Spacer size={0.5} />

            <Description>
              NFT: {tokenId.toString()}@{nftAddress}
            </Description>
            <Spacer />

            <Gallery>
              <img src={test} />
            </Gallery>
          </MetadataContainer>

          <BidContainer>
            <AuctionBidBox
              highestBid={highestBid}
              highestBidder={highestBidder}
              bidIncrement={bidIncrement}
            />
          </BidContainer>
        </Container>
      </Wrapper>
    );
  }
}
