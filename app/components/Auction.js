import React, { Component } from "react";
import { inject, observer, Provider } from "mobx-react";
import styled from "react-emotion";
import { Divider, colors } from "../styles";
import AuctionStore from "../store/auction";
import AuctionInfo from "./AuctionInfo";
import AuctionTimeLeft from "./AuctionTimeLeft";
import AuctionBidBox from "./AuctionBidBox";
import AuctionHighestBid from "./AuctionHighestBid";
import AuctionYourBid from "./AuctionYourBid";

export const Title = styled("div")`
  text-transform: uppercase;
  font-size: 16px;
  font-weight: normal;
  color: ${colors.darkGrey};
`;

export const Content = styled("div")`
  font-size: 40px;
  font-weight: bold;
`;

@inject("store")
@observer
export default class Auction extends Component {
  constructor(props) {
    super(props);
    this.auctionStore = new AuctionStore(props.store, props.auctionId);
  }

  render() {
    const { auction } = this.auctionStore;
    console.log("Render Auction", this.auctionStore.auctionId);
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
