import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import CountDown from "./CountDown";

@inject("auctionStore")
@inject("store")
@observer
export default class AuctionTimeLeft extends Component {
  render() {
    const { auction } = this.props.auctionStore;
    return (
      <div>
        <CountDown endDate={auction.endDate} />
      </div>
    );
  }
}
