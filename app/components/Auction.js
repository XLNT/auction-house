import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { action, autorun, computed, observable, observe, when } from "mobx";
import BigNumber from "bignumber.js";
import styled from "react-emotion";
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

const AuctionGallery = styled("div")`
  width: 100%;
  height: 400px;
  background-color: ${colors.green};
`;

const AuctionHeading = styled("span")`
  font-size: ${fontSizes.huge};
  font-weight: 600;
  display: inline-block;
`;

const AuctionContainer = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: auto;
`;

const AuctionDataContainer = styled("div")`
  width: 70%;
  background-color: ${colors.red};
  float: left;
`;

const AuctionBidContainer = styled("div")`
  width: 30%;
  background-color: ${colors.blue};
  float: right;
`;

@inject("store")
@observer
export default class Auction extends Component {
  @observable auction;
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
  get auctionStatusText() {
    const { status } = this.auction;
    if (status.equals(0)) return "Live";
    else if (status.equals(1)) return "Cancelled";
    else return "Completed";
  }

  @computed
  get auctionStatusColor() {
    const { status } = this.auction;
    if (status.equals(0)) return colors.green;
    else if (status.equals(1)) return colors.yellow;
    else return colors.blue;
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
      startBlock,
      status,
      highestBid,
      highestBidder
    } = this.auction;

    const isActive = status.equals(0);

    return (
      <Wrapper>
        <Spacer />
        <div>
          <AuctionHeading>Auction #{id.toString()}</AuctionHeading>{" "}
          <Badge color={this.auctionStatusColor}>
            {this.auctionStatusText}
          </Badge>
        </div>
        <Spacer />
        <AuctionContainer>
          <AuctionDataContainer>
            <AuctionGallery />
            <div>
              <b>Metadata</b>
              <Spacer size={0.5} />
              <div>
                NFT: {tokenId.toString()}@{nftAddress}
              </div>
              <div>Seller: {seller}</div>
            </div>
          </AuctionDataContainer>
          <AuctionBidContainer>
            <AuctionBidBox
              highestBid={highestBid}
              highestBidder={highestBidder}
              bidIncrement={bidIncrement}
            />
          </AuctionBidContainer>
        </AuctionContainer>
      </Wrapper>
    );
  }
}
