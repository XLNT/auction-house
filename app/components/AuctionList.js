import React, { Component } from "react";
import { action, autorun, observable, observe, runInAction, when } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

@inject("store")
@observer
export default class AuctionList extends Component {
  render() {
    const { auctions, auctionsLength } = this.props.store;
    return (
      <div>
        Auction count: {auctionsLength.toString()}
        <ul>
          {auctions.map(auction => (
            <li key={auction.id}>
              <Link to={`/auction/${auction.id}`}>
                {JSON.stringify(auction)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
