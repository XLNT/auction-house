import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, observe, action, autorun, computed } from "mobx";
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
  background-color: ${colors.yellow};
`;

const AuctionHeading = styled("span")`
  font-size: ${fontSizes.huge};
  font-weight: 600;
  display: inline-block;
`;

@inject("store")
@observer
export default class Auction extends Component {
  @observable auction;
  @observable loadingAuction = true;
  @observable currentAccountBid = new BigNumber(0);
  @observable hideOwnBidWarning = false;

  async componentDidMount() {
    this.auctionBase = await this.props.store.AuctionBase.deployed();
    const { auctionId } = this.props.match.params;
    const watcher = observe(
      this.props.store,
      "currentBlock",
      change => {
        this.getAuction(auctionId);
        this.getCurrentAccountBid(auctionId);
      },
      true // invoke immediately
    );
  }

  @action
  async getAuction(_id) {
    this.loadingAuction = true;
    const { currentBlock } = this.props.store;
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
    ] = await this.auctionBase.getAuction(_id, {}, currentBlock);
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
    const { currentAccount, currentBlock } = this.props.store;
    if (!currentAccount) {
      this.currentAccountBid = new BigNumber(0);
      return false;
    }
    this.currentAccountBid = await this.auctionBase.getBid(
      _id,
      currentAccount,
      {},
      currentBlock
    );
  }

  @action
  async placeBid(bigNumber) {
    const adjustedBid = bigNumber.minus(this.currentAccountBid);
    const params = {
      from: this.props.store.currentAccount,
      value: adjustedBid
    };
    const receipt = await this.auctionBase.bid(this.auction.id, params);
    this.hideOwnBidWarning = false;
  }

  @action
  hideBidWarning() {
    this.hideOwnBidWarning = true;
  }

  @computed
  get nextMinBid() {
    if (!this.auction) return false;
    const { highestBid, bidIncrement } = this.auction;
    return highestBid.plus(bidIncrement).minus(this.currentAccountBid);
  }

  @computed
  get highestEthBid() {
    return this.props.store.web3.fromWei(this.auction.highestBid, "ether");
  }

  @computed
  get showBidBox() {
    const ownHighestBid =
      this.auction.highestBidder == this.props.store.currentAccount;
    return !ownHighestBid || this.hideOwnBidWarning;
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
          <AuctionHeading>Auction {id.toString()}</AuctionHeading>{" "}
          {isActive && <Badge color={colors.green}>LIVE</Badge>}
        </div>
        <Spacer />
        <AuctionGallery />
        <Spacer />
        <div>
          <b>Metadata</b>
          <Spacer size={0.5} />
          <div>
            NFT: {tokenId.toString()}@{nftAddress}
          </div>
          <div>Seller: {seller}</div>
        </div>
        <Spacer />
        <div>
          <b>Current highest bid:</b>{" "}
          {highestBid > 0 ? (
            <span>
              {this.highestEthBid.toString()} ETH from{" "}
              {highestBidder == this.props.store.currentAccount
                ? "you"
                : highestBidder}
            </span>
          ) : (
            <span>No bids yet</span>
          )}
        </div>
        <Spacer />
        {this.showBidBox ? (
          <AuctionBidBox
            highestBid={highestBid}
            bidIncrement={bidIncrement}
            callback={bid => this.placeBid(bid)}
          />
        ) : (
          <span>
            <b>🎉 You're the highest bidder!</b>{" "}
            <a onClick={() => this.hideBidWarning()}>Bid higher?</a>
          </span>
        )}
        <Spacer size={2} />
      </Wrapper>
    );
  }
}
