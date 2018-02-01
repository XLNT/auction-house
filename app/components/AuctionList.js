import React, { Component } from "react";
import { action, observable, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import AuctionFactory from "../../build/contracts/AuctionFactory.json";

@inject("store")
@observer
export default class AuctionList extends Component {
  @observable auctions = [];
  @observable auctionFactory;

  componentDidMount() {
    runInAction(() => {
      this.auctionFactory = this.props.store.web3.eth
        .contract(AuctionFactory.abi)
        .at("0x3d49d1ef2ade060a33c6e6aa213513a7ee9a6241".toLowerCase());
    });
    this.getAuctions();
  }

  getAuctions() {
    this.auctionFactory.getAuctions(
      action((err, res) => {
        this.auctions = res;
      })
    );
  }

  createAuction() {
    const bidIncrement = this.props.store.web3.toWei(0.1, "ether");
    this.auctionFactory.createAuction(
      bidIncrement,
      { from: this.props.store.currentAccount },
      (err, res) => {
        this.getAuctions();
      }
    );
  }

  render() {
    return (
      <div>
        <h1>Auctions ({this.auctions.length} total)</h1>
        <ul>
          {this.auctions.map(auction => (
            <li key={auction}>
              <Link to={`/auction/${auction}`}>{auction}</Link>
            </li>
          ))}
        </ul>
        <button onClick={() => this.createAuction()}>Create Auction</button>
      </div>
    );
  }
}
