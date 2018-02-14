import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Title, Content } from "./Auction";
import CountDown from "./CountDown";

@inject("auctionStore")
@observer
export default class AuctionTimeLeft extends Component {
  render() {
    const { auction } = this.props.auctionStore;
    return (
      <div>
        <Title>Time left</Title>
        <Content>
          <CountDown endDate={auction.endDate} />
        </Content>
      </div>
    );
  }
}
