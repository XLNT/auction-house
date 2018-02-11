import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { observable, action, runInAction, computed } from "mobx";
import styled from "react-emotion";
import BigNumber from "bignumber.js";

import {
  Button,
  Input,
  Spacer,
  Divider,
  Centered,
  basePadding,
  colors,
  lighten,
  transform
} from "../styles";

import { Line } from "./auction/auction";

import CountDown from "./CountDown";

const Container = styled("div")`
  border-radius: 8px;
  display: block;
  background-color: white;
  box-shadow: 0 3px 8px 0 ${colors.darkGrey};
`;

const ContainerSection = styled("div")`
  padding: ${basePadding / 2}px ${basePadding / 2}px;
  display: block;
`;

const SectionTitle = styled("div")`
  text-transform: uppercase;
  font-size: 16px;
  font-weight: normal;
  color: ${colors.darkGrey};
`;

const SectionData = styled("div")`
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
    background-color: ${lighten(`black`, 25)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActionButton = styled("button")`
  display: inline-block;
  background-color: ${colors.white};
  border: 1px solid ${colors.darkGrey};
  padding: ${basePadding / 2}px ${basePadding}px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 6px;
  background-color: black;
  color: white;
  text-transform: uppercase;

  &:hover {
    background-color: ${lighten(`black`, 25)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Explanation = styled("div")`
  font-size: 16px;
  padding: ${basePadding / 2}px;
`;

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
    this.props.bidCallback(this.newBid);
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
    return this.newBid.minus(this.props.bidIncrement);
  }

  @computed
  get upBid() {
    return this.newBid.plus(this.props.bidIncrement);
  }

  @computed
  get minBid() {
    return this.props.highestBid.plus(this.props.bidIncrement);
  }

  @computed
  get newEthBid() {
    return this.props.store.web3.fromWei(this.newBid, "ether");
  }

  @computed
  get highestBid() {
    return this.props.store.web3.fromWei(this.props.highestBid, "ether");
  }

  @computed
  get currentBid() {
    return this.props.store.web3.fromWei(this.props.currentAccountBid, "ether");
  }

  @computed
  get auctionCompleted() {
    return this.props.statusText != "Live";
  }

  @computed
  get userHasParticipated() {
    console.log(this.currentBid.toNumber());
    return this.currentBid.toNumber() != 0;
  }

  @computed
  get isFirstBidInAuction() {
    return this.highestBid.toNumber() == 0;
  }

  @computed
  get userIsWinner() {
    return this.highestBidder == this.props.store.currentAccount;
  }

  render() {
    return (
      <Centered>
        <Container>
          <ContainerSection>
            <Spacer />
            <SectionTitle> Time Left</SectionTitle>
            <CountDown
              endDate={new Date().getTime() + 100000000}
              completed={this.auctionCompleted}
            />
          </ContainerSection>
          <Line />
          {!this.isFirstBidInAuction &&
            this.statusText !== "Cancelled" && (
              <span>
                <ContainerSection>
                  <SectionTitle>Highest Bid</SectionTitle>
                  <SectionData>{this.highestBid.toNumber()} ETH</SectionData>
                </ContainerSection>
                <Line />
              </span>
            )}
          {this.statusText !== "Cancelled" && (
            <span>
              <ContainerSection>
                <SectionTitle>Your Bid</SectionTitle>
                {this.userHasParticipated ? (
                  <SectionData>{this.currentBid.toNumber()} ETH</SectionData>
                ) : (
                  <Explanation>You haven't placed a bid yet.</Explanation>
                )}
              </ContainerSection>
              <Line />
            </span>
          )}
          {this.props.statusText === "Live" && (
            <ContainerSection>
              <SectionTitle>Place Bid</SectionTitle>

              <SectionData>
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
              </SectionData>
              <Spacer />
              <ActionButton onClick={() => this.submitBid()}>
                {this.userHasParticipated ? "Another one" : "Place first bid"}
              </ActionButton>
              <Spacer />
            </ContainerSection>
          )}
          {this.props.statusText === "Cancelled" && (
            <ContainerSection>
              <SectionTitle>Withdraw Funds</SectionTitle>

              {this.userHasParticipated && (
                <span>
                  <Explanation>
                    Unfortunately, this auction has been cancelled. Please
                    withdraw your funds.
                  </Explanation>

                  <ActionButton onClick={() => this.withdrawBalance()}>
                    Withdraw
                  </ActionButton>
                  <Spacer />
                </span>
              )}
            </ContainerSection>
          )}
          {this.props.statusText === "Completed" && (
            <ContainerSection>
              {this.userIsWinner ? (
                <span>
                  <SectionTitle>Withdraw Art</SectionTitle>
                  <Explanation>
                    Congratulations, you won the auction!
                  </Explanation>

                  <ActionButton onClick={() => this.withdrawBalance()}>
                    Claim Your Artwork
                  </ActionButton>
                  <Spacer />
                </span>
              ) : (
                <span>
                  <SectionTitle>Withdraw Funds</SectionTitle>
                  <Explanation>
                    Sorry you didn't win the auction. Please withdraw your
                    funds.
                  </Explanation>

                  <ActionButton onClick={() => this.withdrawBalance()}>
                    Withdraw
                  </ActionButton>
                  <Spacer />
                </span>
              )}
            </ContainerSection>
          )}
        </Container>
      </Centered>
    );
  }
}

AuctionBidBox.propTypes = {
  highestBid: PropTypes.object.isRequired,
  highestBidder: PropTypes.string.isRequired,
  bidIncrement: PropTypes.object.isRequired,
  bidCallback: PropTypes.func.isRequired,
  withdrawCallback: PropTypes.func.isRequired,
  statusText: PropTypes.string.isRequired
};
