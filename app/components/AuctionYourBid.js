import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Title, Content } from "./Auction";

@inject("auctionStore")
@inject("store")
@observer
export default class AuctionYourBid extends Component {
  render() {
    const { currentAccountBid, userHasParticipated } = this.props.auctionStore;
    const ethBid = this.props.store.web3.fromWei(currentAccountBid, "ether");
    return (
      <div>
        <Title>Your Bid</Title>
        {userHasParticipated ? (
          <Content>{ethBid.toNumber()} ETH</Content>
        ) : (
          <Content small>You haven't placed a bid yet.</Content>
        )}
      </div>
    );
  }
}
