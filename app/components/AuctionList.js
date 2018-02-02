import React, { Component } from "react";
import { action, observable, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import AuctionFactory from "../../build/contracts/AuctionFactory.json";

@inject("store")
@observer
export default class AuctionList extends Component {
  @observable auctions = [];
  @observable events = [];

  constructor(props) {
    super(props);
    this.auctionFactory = props.store.web3.eth
      .contract(AuctionFactory.abi)
      .at("0x3d49d1ef2ade060a33c6e6aa213513a7ee9a6241".toLowerCase());
    window.s = this;
  }

  componentDidMount() {
    this.getAuctions();
    //this.eventInterval = setInterval(() => this.getEvents(), 1000); // Ugh ಠ_ಠ
  }

  componentWillUnmount() {
    if (this.eventInterval) {
      clearInterval(this.eventInterval);
    }
  }

  getEvents() {
    const events = this.auctionFactory.allEvents({
      fromBlock: 0,
      toBlock: "latest"
    });
    events.get((err, res) => {
      console.log("AUCTIONS!!", res);
    });
  }

  getAuctions() {
    console.log("getAuctions");
    this.auctionFactory.getAuctions(
      action((err, res) => {
        this.auctions = res;
      })
    );
  }

  createAuction() {
    const bidIncrement = this.props.store.web3.toWei(0.1, "ether");
    const createPromise = new Promise((resolve, reject) => {
      this.auctionFactory.createAuction(
        bidIncrement,
        { from: this.props.store.currentAccount },
        (err, res) => {
          const transactionHash = res;
          console.log("Init transaction", transactionHash);
          const interval = setInterval(() => {
            this.props.store.web3.eth.getTransactionReceipt(
              transactionHash,
              (err, res) => {
                console.log("res", res.status, res);
                if (res && res.status == 1) {
                  console.log("Resolve");
                  clearInterval(interval);
                  resolve();
                } else {
                  console.log("Go again?");
                }
              }
            );
          }, 500);
        }
      );
    });
    createPromise.then(data => {
      console.log("THEN", data);
      this.getAuctions();
    });
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
