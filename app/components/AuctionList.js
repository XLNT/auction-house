import React, { Component } from "react";
import { observable, observe, when } from "mobx";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Badge, Heading, Spacer } from "../styles";

@withRouter
@inject("store")
@observer
export default class AuctionList extends Component {
  navigateTo(path) {
    this.props.close();
    this.props.history.push(path);
  }

  render() {
    const { auctions, auctionsLength } = this.props.store;
    return (
      <div>
        <Heading>
          XLNT Drops <small>{auctionsLength.toString()} TOTAL</small>
        </Heading>
        <Spacer />
        <div>
          {auctions.map(auction => {
            const metadata = auction.nftMetadata || {};
            return (
              <div key={auction.id.toString()}>
                {auction.id.toString()}.{" "}
                <a
                  onClick={e => {
                    this.navigateTo(`/auction/${auction.id}`);
                    e.stopPropagation();
                  }}
                >
                  <strong>{metadata.name}</strong> by {metadata.creator}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
