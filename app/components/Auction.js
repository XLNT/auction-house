import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { action, autorun, computed, observable, observe, when } from "mobx";
import BigNumber from "bignumber.js";
import moment from "moment";
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
import test from "../images/test.png";
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
          },
          true // invoke immediately
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
    const {
      auctionBaseInstance,
      currentBlock,
      curatorInstance,
      ipfsNode
    } = this.props.store;
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

    const nftData = await curatorInstance.assetData(tokenId, currentBlock);

    const data = await ipfsNode.object.data(nftData);
    const jsonData = JSON.parse(data.toString());

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
      highestBidder,
      nftMetadata: jsonData
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
  get endDate() {
    const { duration, startedAt } = this.auction;
    // duration is in block numbers
    const startDate = moment.unix(startedAt.toString());
    const endDate = startDate.add(duration.toNumber() * 14, "seconds");
    return endDate.toDate();
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
      highestBidder,
      nftMetadata
    } = this.auction;

    const { creator, description, name, resourceIdentifiers } = nftMetadata;

    return (
      <Wrapper>
        <Spacer size={3} />
        <Container>
          <LeftContainer width={60}>
            <Status>
              {this.statusText}{" "}
              <StatusPulse
                active={this.statusText == "Live"}
                color={this.statusColor}
              />
            </Status>

            <Spacer size={0.5} />

            <Heading>Auction #{id.toString()}</Heading>
            <SellerInformation>by {seller}</SellerInformation>
            <Spacer size={0.5} />
            <Description>
              NFT: {tokenId.toString()}@{nftAddress}
              <Spacer />
              Name: {name}
              <Spacer />
              Creator: {creator}
              <Spacer />
              Description: {description}
            </Description>
            <Spacer />

            <Gallery>
              <img
                src={`https://ipfs.io/ipfs/${resourceIdentifiers.default}`}
              />
            </Gallery>
          </LeftContainer>

          <RightContainer width={35}>
            <AuctionBidBox
              endDate={this.endDate}
              highestBid={highestBid}
              highestBidder={highestBidder}
              bidIncrement={bidIncrement}
              currentAccountBid={this.currentAccountBid}
              statusText={this.statusText}
              bidCallback={bid => this.placeBid(bid)}
              withdrawCallback={() => this.withdrawBalance()}
            />
          </RightContainer>
        </Container>
      </Wrapper>
    );
  }
}
