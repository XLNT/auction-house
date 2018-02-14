import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, action, runInAction, computed } from "mobx";
import styled from "react-emotion";
import BigNumber from "bignumber.js";
import { Spacer, lighten, Button } from "../styles";
import { Title, Content } from "./Auction";

const BidButton = styled(Button)`
  font-size: 0.6em;
  vertical-align: top;
  width: auto;
  line-height: 2;
  height: auto;
  padding: 0;
  width: 2em;
`;

@inject("auctionStore")
@inject("store")
@observer
export default class AuctionBidBox extends Component {
  @observable newBid = new BigNumber(0);

  componentDidMount() {
    runInAction(() => (this.newBid = this.minBid));
  }

  bidIsValid(newBid) {
    return newBid.gte(this.minBid);
  }

  @action
  updateBid(newBid) {
    this.newBid = newBid;
  }

  @computed
  get downBid() {
    const { bidIncrement } = this.props.auctionStore.auction;
    return this.newBid.minus(bidIncrement);
  }

  @computed
  get upBid() {
    const { bidIncrement } = this.props.auctionStore.auction;
    return this.newBid.plus(bidIncrement);
  }

  @computed
  get minBid() {
    const { highestBid, bidIncrement } = this.props.auctionStore.auction;
    return highestBid.plus(bidIncrement);
  }

  @computed
  get newEthBid() {
    return this.props.store.web3.fromWei(this.newBid, "ether");
  }

  render() {
    const {
      userHasParticipated,
      userIsHighestBidder
    } = this.props.auctionStore;
    return (
      <div>
        {this.props.auctionStore.statusIs("Live") && (
          <div>
            <Title>Place Bid</Title>
            <Spacer size={0.5} />
            <Content>
              <BidButton
                disabled={!this.bidIsValid(this.downBid)}
                onClick={() => this.updateBid(this.downBid)}
              >
                -
              </BidButton>{" "}
              {this.newEthBid.toNumber()} ETH{" "}
              <BidButton
                disabled={!this.bidIsValid(this.upBid)}
                onClick={() => this.updateBid(this.upBid)}
              >
                +
              </BidButton>
            </Content>
            <Spacer />
            <Button
              onClick={() => this.props.auctionStore.placeBid(this.newBid)}
            >
              {userHasParticipated ? "Place another bid" : "Place first bid"}
            </Button>
          </div>
        )}
        {this.props.auctionStore.statusIs("Cancelled") && (
          <div>
            <Title>Withdraw Funds</Title>

            {userHasParticipated && (
              <span>
                <Content small>
                  Unfortunately, this auction has been cancelled. Please
                  withdraw your funds.
                </Content>

                <Button
                  onClick={() => this.props.auctionStore.withdrawBalance()}
                >
                  Withdraw
                </Button>
              </span>
            )}
          </div>
        )}
        {this.props.auctionStore.statusIs("Completed") && (
          <div>
            {userIsHighestBidder ? (
              <span>
                <Title>Withdraw Art</Title>
                <Content small>Congratulations, you won the auction!</Content>

                <Button
                  onClick={() => this.props.auctionStore.withdrawBalance()}
                >
                  Claim Your Artwork
                </Button>
                <Spacer />
              </span>
            ) : (
              <span>
                <Title>Withdraw Funds</Title>
                <Content small>
                  Sorry you didn't win the auction. Please withdraw your funds.
                </Content>

                <Button
                  onClick={() => this.props.auctionStore.withdrawBalance()}
                >
                  Withdraw
                </Button>
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
}
