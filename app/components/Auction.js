import React, { Component } from "react";
import { inject, observer, Provider } from "mobx-react";
import { Divider } from "../styles";
import AuctionStore from "../store/auction";
import AuctionInfo from "./AuctionInfo";
import AuctionTimeLeft from "./AuctionTimeLeft";
import AuctionBidBox from "./AuctionBidBox";
import AuctionHighestBid from "./AuctionHighestBid";
import AuctionYourBid from "./AuctionYourBid";

@inject("store")
@observer
export default class Auction extends Component {
  constructor(props) {
    super(props);
    this.auctionStore = new AuctionStore(props.store, props.auctionId);
  }

  render() {
    const { auction } = this.auctionStore;
    return (
      <Provider auctionStore={this.auctionStore}>
        {auction ? (
          <div>
            <AuctionInfo />
            <Divider padded />
            <AuctionTimeLeft />
            <Divider padded />
            <AuctionHighestBid />
            <Divider padded />
            <AuctionYourBid />
            <Divider padded />
            <AuctionBidBox />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Provider>
    );
  }
}
