import React, { Component } from "react";
import { action, observable, observe, autorun, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

@inject("store")
@observer
export default class AuctionList extends Component {
  @observable auctions = [];

  async componentDidMount() {
    this.auctionFactory = await this.props.store.AuctionFactory.deployed();
    this.getAuctions();
    const watcher = observe(this.props.store, "currentBlock", change => {
      this.getAuctions();
    });
  }

  async getAuctions() {
    this.auctions = await this.auctionFactory.getAuctions(
      {},
      this.props.store.currentBlock
    );
  }

  async createAuction() {
    const bidIncrement = this.props.store.web3.toWei(0.1, "ether");
    const receipt = await this.auctionFactory.createAuction(bidIncrement, {
      from: this.props.store.currentAccount
    });
    console.log("New auction transaction", receipt);
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
