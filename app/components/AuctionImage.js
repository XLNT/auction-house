import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Spacer, fontSizes, fontWeights, colors, Text } from "../styles";
import styled, { keyframes } from "react-emotion";
import hero from "../images/Miriam.jpg";

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
  render() {
    return <Hero src={hero} />;
  }
}
