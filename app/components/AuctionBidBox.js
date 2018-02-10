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
  lighten
} from "../styles";

import CountDown from "./CountDown";

const Container = styled("div")`
  border-radius: 8px;
  display: block;
  background-color: white;
`;

const ContainerSection = styled("div")`
  padding: ${basePadding}px ${basePadding / 2}px;
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
    this.props.callback(this.newBid);
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

  render() {
    return (
      <Centered>
        <Container>
          <ContainerSection>
            <SectionTitle> Time Left</SectionTitle>
            <CountDown endDate={new Date().getTime() + 100000000} />
          </ContainerSection>

          <ContainerSection>
            <SectionTitle>Highest Bid</SectionTitle>
            <SectionData>{this.highestBid.toNumber()} ETH</SectionData>
          </ContainerSection>

          <ContainerSection>
            <SectionTitle>Your Bid</SectionTitle>
            <SectionData>{this.currentBid.toNumber()} ETH</SectionData>
          </ContainerSection>

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
            <br />
            <ActionButton onClick={() => this.submitBid()}>
              Place Bid
            </ActionButton>
            {this.showErrors && <div>Error: {this.errors.join(", ")}</div>}
          </ContainerSection>
        </Container>
      </Centered>
    );
  }
}

AuctionBidBox.propTypes = {
  highestBid: PropTypes.object.isRequired,
  highestBidder: PropTypes.string.isRequired,
  bidIncrement: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired
};
