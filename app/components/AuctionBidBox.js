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

  render() {
    return (
      <div>
        <span>{this.newEthBid.toNumber()} ETH</span>{" "}
        <Button
          disabled={!this.bidIsValid(this.downBid)}
          onClick={() => this.updateBid(this.downBid)}
        >
          -
        </Button>
        <Button
          disabled={!this.bidIsValid(this.upBid)}
          onClick={() => this.updateBid(this.upBid)}
        >
          +
        </Button>
        <Button onClick={() => this.submitBid()}>Place Bid!!</Button>
        {this.showErrors && <div>Error: {this.errors.join(", ")}</div>}
      </div>
    );
  }
}

AuctionBidBox.propTypes = {
  highestBid: PropTypes.object.isRequired,
  bidIncrement: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired
};
