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
  colors
} from "../styles";

const Container = styled("div")`
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  display: block;
`;

const ContainerBody = styled("div")`
  border-bottom: 1px solid ${colors.grey}
  padding: ${basePadding}px;
  display: block;
  &:last-child {
    border-bottom: 0 none;
  }
`;

const SectionTitle = styled("div")`
  text-transform: uppercase;
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

  @action
  async placeBid() {
    const { auctionBaseInstance } = this.props.store;
    const adjustedBid = this.newBid.minus(this.currentAccountBid);
    const params = {
      from: this.props.store.currentAccount,
      value: adjustedBid
    };
    const receipt = await auctionBaseInstance.bid(this.auction.id, params);
    this.hideOwnBidWarning = false;
  }

  @action
  hideBidWarning() {
    this.hideOwnBidWarning = true;
  }

  @action
  updateBid(newBid) {
    this.newBid = newBid;
  }

  @computed
  get showBidBox() {
    const ownHighestBid =
      this.auction.highestBidder == this.props.store.currentAccount;
    return !ownHighestBid || this.hideOwnBidWarning;
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

  // {this.showBidBox ? (
  //   <AuctionBidBox
  //     highestBid={highestBid}
  //     highestBidder={highestBidder}
  //     bidIncrement={bidIncrement}
  //   />
  // ) : (
  //   <span>
  //     <b>🎉 You're the highest bidder!</b> <Spacer />
  //     <a
  //       style={{ color: "#111" }}
  //       onClick={() => this.hideBidWarning()}
  //     >
  //       Bid higher?
  //     </a>
  //   </span>
  // )}

  render() {
    return (
      <div>
        <Container>
          <ContainerBody>
            <SectionTitle>Place Bid</SectionTitle>
            <Centered>
              <Button
                disabled={!this.bidIsValid(this.downBid)}
                onClick={() => this.updateBid(this.downBid)}
              >
                -
              </Button>{" "}
              <span>{this.newEthBid.toNumber()} ETH</span>{" "}
              <Button
                disabled={!this.bidIsValid(this.upBid)}
                onClick={() => this.updateBid(this.upBid)}
              >
                +
              </Button>{" "}
              <Button onClick={() => this.placeBid()}>Place Bid!!</Button>
              {this.showErrors && <div>Error: {this.errors.join(", ")}</div>}
            </Centered>
          </ContainerBody>
        </Container>
      </div>
    );
  }
}

AuctionBidBox.propTypes = {
  highestBid: PropTypes.object.isRequired,
  highestBidder: PropTypes.string.isRequired,
  bidIncrement: PropTypes.object.isRequired
};
