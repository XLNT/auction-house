import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { observable, action, runInAction, computed } from "mobx";
import styled from "react-emotion";
import BigNumber from "bignumber.js";

import { Spacer, Centered, basePadding, colors, lighten } from "../styles";
import { Line } from "./auction/auction";
import CountDown from "./CountDown";

const Title = styled("div")`
  text-transform: uppercase;
  font-size: 16px;
  font-weight: normal;
  color: ${colors.darkGrey};
`;

const Content = styled("div")`
  font-size: 40px;
  font-weight: bold;
`;

const BidButton = styled("button")`
  display: inline-block;
  background-color: black;
  color: white;
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  transform: translateY(-8px);
  font-size: 16px;

  &:hover {
    background-color: ${lighten("black", 25)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

@inject("auctionStore")
@inject("store")
@observer
export default class AuctionBidBox extends Component {
  @observable newBid = new BigNumber(0);

  componentDidMount() {
    runInAction(() => (this.newBid = this.minBid));
  }

  bidIsValid(newBid) {
    return newBid.gte(this.minBid);
  }

  submitBid() {
    this.props.auctionStore.placeBid(this.newBid);
  }

  withdrawBalance() {
    this.props.withdrawCallback();
  }

  @action
  updateBid(newBid) {
    this.newBid = newBid;
  }

  @computed
  get downBid() {
    const { bidIncrement } = this.props.auctionStore.auction;
    return this.newBid.minus(bidIncrement);
  }

  @computed
  get upBid() {
    const { bidIncrement } = this.props.auctionStore.auction;
    return this.newBid.plus(bidIncrement);
  }

  @computed
  get minBid() {
    const { highestBid, bidIncrement } = this.props.auctionStore.auction;
    return highestBid.plus(bidIncrement);
  }

  @computed
  get newEthBid() {
    return this.props.store.web3.fromWei(this.newBid, "ether");
  }

  @computed
  get currentBid() {
    const { currentAccountBid } = this.props.auctionStore;
    return this.props.store.web3.fromWei(currentAccountBid, "ether");
  }

  @computed
  get userHasParticipated() {
    return this.currentBid.toNumber() != 0;
  }

  @computed
  get isFirstBidInAuction() {
    const { highestBid } = this.props.auctionStore.auction;
    return highestBid.toNumber() == 0;
  }

  @computed
  get userIsWinner() {
    const { highestBidder } = this.props.auctionStore.auction;
    return highestBidder == this.props.store.currentAccount;
  }

  render() {
    return (
      <div>
        {this.props.auctionStore.statusIs("Live") && (
          <div>
            <Title>Place Bid</Title>

            <Content>
              <BidButton
                disabled={!this.bidIsValid(this.downBid)}
                onClick={() => this.updateBid(this.downBid)}
              >
                -
              </BidButton>{" "}
              {this.newEthBid.toNumber()} ETH{" "}
              <BidButton
                disabled={!this.bidIsValid(this.upBid)}
                onClick={() => this.updateBid(this.upBid)}
              >
                +
              </BidButton>
            </Content>
            <Spacer />
            <Button onClick={() => this.submitBid()}>
              {this.userHasParticipated ? "Another one" : "Place first bid"}
            </Button>
            <Spacer />
          </div>
        )}
        {this.props.auctionStore.statusIs("Cancelled") && (
          <div>
            <Title>Withdraw Funds</Title>

            {this.userHasParticipated && (
              <span>
                <Content small>
                  Unfortunately, this auction has been cancelled. Please
                  withdraw your funds.
                </Content>

                <Button onClick={() => this.withdrawBalance()}>Withdraw</Button>
                <Spacer />
              </span>
            )}
          </div>
        )}
        {this.props.auctionStore.statusIs("Completed") && (
          <div>
            {this.userIsWinner ? (
              <span>
                <Title>Withdraw Art</Title>
                <Content small>Congratulations, you won the auction!</Content>

                <Button onClick={() => this.withdrawBalance()}>
                  Claim Your Artwork
                </Button>
                <Spacer />
              </span>
            ) : (
              <span>
                <Title>Withdraw Funds</Title>
                <Content small>
                  Sorry you didn't win the auction. Please withdraw your funds.
                </Content>

                <Button onClick={() => this.withdrawBalance()}>Withdraw</Button>
                <Spacer />
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
}
