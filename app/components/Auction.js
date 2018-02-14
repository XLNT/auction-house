import React, { Component } from "react";
import { inject, observer, Provider } from "mobx-react";
import styled from "react-emotion";
import { Divider, colors, fontSizes, Text, Spacer } from "../styles";
import AuctionStore from "../store/auction";
import AuctionInfo from "./AuctionInfo";
import AuctionTimeLeft from "./AuctionTimeLeft";
import AuctionBidBox from "./AuctionBidBox";
import AuctionHighestBid from "./AuctionHighestBid";
import AuctionYourBid from "./AuctionYourBid";

const AuctionFlex = styled("div")`
  display: flex;
`;

const FlexItem = styled("div")`
  flex-basis: 50%;
`;

export class Title extends Component {
  render() {
    return (
      <div>
        <Text size={fontSizes.small} grey uppercase inline>
          {this.props.children}
        </Text>
      </div>
    );
  }
}

export class Content extends Component {
  render() {
    return <Text size={fontSizes.bigger}>{this.props.children}</Text>;
  }
}

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
            <AuctionFlex>
              <FlexItem>
                <AuctionTimeLeft />
              </FlexItem>
              <FlexItem>
                <AuctionHighestBid />
              </FlexItem>
            </AuctionFlex>
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
