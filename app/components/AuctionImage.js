import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { computed } from "mobx";
import { Spacer, fontSizes, fontWeights, colors, Text } from "../styles";
import styled, { keyframes } from "react-emotion";

const Hero = styled("img")`
  position: fixed;
  display: block;
  width: 90%;
  top: 40px;
  left: 400px;
  z-index: -1;
`;

@inject("store")
@observer
export default class AuctionImage extends Component {
  @computed
  get backgroundSrc() {
    const { backgroundAuction } = this.props.store;
    if (!backgroundAuction) return null;
    return `https://ipfs.io/ipfs/${
      backgroundAuction.nftMetadata.resourceIdentifiers.default
    }`;
  }

  render() {
    return <Hero src={this.backgroundSrc} />;
  }
}
