import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { computed } from "mobx";
import styled, { keyframes } from "react-emotion";
import {
  Wrapper,
  Spacer,
  headerHeight,
  basePadding,
  colors,
  Centered
} from "../styles";
import metamask from "../images/metamask.png";

function shakeBuilder() {
  const shake = keyframes`
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  `;
  return shake;
}

const Heading = styled("div")`
  font-size: 40px;
  color: white;
  width: 100%;
  font-weight: bold;
`;

const Description = styled("div")`
  font-size: 28px;
  font-weight: 200;
  color: ${colors.darkGrey};
  width: 100%;

  & img {
    height: 300px;

    &:hover {
      cursor: pointer;
      animation: ${shakeBuilder()} 0.5s;
      animation-iteration-count: infinite;
    }
  }
`;

const WarningBar = styled("div")`
  position: fixed;
  top: 0;
  border: 2px solid ${colors.supreme};
  width: 100%;
`;

const WarningBadge = styled("span")`
  display: inline-block;
  line-height: 1;
  border-radius: 4px;
  padding: 5px 7px;
  background-color: ${colors.supreme};
  color: white;
  text-transform: uppercase;
  font-size: 40px;
  font-weight: 600;
  vertical-align: middle;
`;

class MetamaskLocked extends Component {
  render() {
    return (
      <span>
        <WarningBar />
        <Wrapper>
          <Spacer size={4} />
          <Centered>
            <Heading>Your Metamask is locked</Heading>
            <Spacer />
            <Description>
              Simply open MetaMask and follow the instructions to unlock it.{" "}
              <br />If you don't have Metamask, click on the icon to learn more.
              <Spacer size={0.1} />
              <a
                href="https://www.youtube.com/watch?v=tfETpi-9ORs"
                target="_blank"
              >
                <img src={metamask} />
              </a>
            </Description>
          </Centered>
        </Wrapper>
      </span>
    );
  }
}

class WrongNetwork extends Component {
  render() {
    return (
      <span>
        <WarningBar />
        <Wrapper>
          <Spacer size={4} />
          <Centered>
            <Heading>
              You are connected to{" "}
              <WarningBadge>{this.props.networkName}</WarningBadge>
            </Heading>
            <Spacer />
            <Description>
              Please switch to the main network on Metamask. <br />If you are
              not sure how, click on the icon to learn more.
              <Spacer size={0.1} />
              <a
                href="https://www.youtube.com/watch?v=tfETpi-9ORs"
                target="_blank"
              >
                <img src={metamask} />
              </a>
            </Description>
          </Centered>
        </Wrapper>
      </span>
    );
  }
}

@inject("store")
@observer
export default class MetamaskRequired extends Component {
  @computed
  get currentNetworkName() {
    if (this.props.currentNetwork === "1") return "mainnet";
    if (this.props.currentNetwork === "2") return "morden";
    if (this.props.currentNetwork === "3") return "ropsten";
    else return "unknown network";
  }

  render() {
    const { currentAccount, currentNetwork } = this.props.store;
    if (!currentAccount) return <MetamaskLocked />;
    if (process.env.STAGE !== "development" && currentNetwork !== "1")
      return <WrongNetwork networkName={this.currentNetworkName} />;
    return this.props.children;
  }
}
