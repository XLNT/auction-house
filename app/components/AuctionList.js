import React, { Component } from "react";
import { action, observable, observe, autorun, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import AuctionFactory from "../../build/contracts/AuctionFactory.json";

@inject("store")
@observer
export default class AuctionList extends Component {
  @observable auctions = [];

  constructor(props) {
    super(props);
    this.auctionFactory = props.store.web3.eth
      .contract(AuctionFactory.abi)
      .at("0x49e6e49ea23c556c07850ffcd70128cd532ce825".toLowerCase());
    window.s = this;
  }

  componentDidMount() {
    this.getAuctions();
    const watcher = observe(this.props.store, "currentBlock", change => {
      this.getAuctions();
    });
  }

  getAuctions() {
    this.auctionFactory.getAuctions(
      {},
      this.props.store.currentBlock,
      action((err, res) => {
        this.auctions = res;
      })
    );
  }

  createAuction() {
    const bidIncrement = this.props.store.web3.toWei(0.1, "ether");
    this.auctionFactory.createAuction(
      bidIncrement,
      {
        from: this.props.store.currentAccount
      },
      (err, res) => {
        console.log("New auction transaction hash", res);
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
