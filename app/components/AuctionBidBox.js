import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { observable, action, runInAction, computed } from "mobx";
import BigNumber from "bignumber.js";
import { Button, Input } from "../styles";

@inject("store")
@observer
export default class AuctionBidBox extends Component {
  @observable newBid = new BigNumber(0);

  componentDidMount() {
    runInAction(() => (this.newBid = this.minBid));
  }

  submitBid() {
    this.props.callback(this.newBid);
  }

  @action
  hideBidWarning() {
    this.hideOwnBidWarning = true;
  }

  @computed
  get showBidBox() {
    const ownHighestBid =
      this.auction.highestBidder == this.props.store.currentAccount;
    return !ownHighestBid || this.hideOwnBidWarning;
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

  bidIsValid(newBid) {
    return newBid.gte(this.minBid);
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
        <span>{this.newEthBid.toNumber()} ETH</span>{" "}
        <Button
          disabled={!this.bidIsValid(this.downBid)}
          onClick={() => this.updateBid(this.downBid)}
        >
          -
        </Button>{" "}
        <Button
          disabled={!this.bidIsValid(this.upBid)}
          onClick={() => this.updateBid(this.upBid)}
        >
          +
        </Button>{" "}
        <Button onClick={() => this.submitBid()}>Place Bid!!</Button>
        {this.showErrors && <div>Error: {this.errors.join(", ")}</div>}
      </div>
    );
  }
}

AuctionBidBox.propTypes = {
  highestBid: PropTypes.object.isRequired,
  highestBidder: PropTypes.object.isRequired,
  bidIncrement: PropTypes.object.isRequired
};
