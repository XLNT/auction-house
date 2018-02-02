import React, { Component } from "react";
import { action, observable, autorun, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import AuctionFactory from "../../build/contracts/AuctionFactory.json";

@inject("store")
@observer
export default class AuctionList extends Component {
  @observable auctions = [];
  @observable currentBlock;

  constructor(props) {
    super(props);
    this.auctionFactory = props.store.web3.eth
      .contract(AuctionFactory.abi)
      .at("0x565c2b576c2002d9bbea5bca0a4fd8bf0acab38b".toLowerCase());
    window.s = this;
  }

  componentDidMount() {
    this.eventInterval = setInterval(() => {
      this.props.store.web3.eth.getBlock(
        "latest",
        action((err, res) => {
          if (res.number != this.currentBlock) {
            console.log(
              "Changing current block from",
              this.currentBlock,
              "to",
              res.number
            );
            this.currentBlock = res.number;
            this.getAuctions();
          }
        })
      );
    }, 1000); // Ugh ಠ_ಠ
  }

  componentWillUnmount() {
    if (this.eventInterval) {
      clearInterval(this.eventInterval);
    }
  }

  getAuctions() {
    this.auctionFactory.getAuctions(
      {},
      this.currentBlock || "latest",
      (err, res) => {
        this.auctions = res[0];
        console.log(
          "getAuctions block number",
          this.currentBlock,
          res[1].toString()
        );
      }
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
