import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "react-emotion";
import hero from "../images/Miriam.jpg";
import Header from "./Header";
import DesktopWindow from "./DesktopWindow";

const Hero = styled("img")`
  position: fixed;
  display: block;
  width: 90%;
  top: 40px;
  left: 400px;
  z-index: -1;
`;

const Container = styled("div")`
  position: relative;
`;

@inject("store")
@observer
export default class Desktop extends Component {
  statusText(status) {
    if (status.equals(0)) return "Live";
    else if (status.equals(1)) return "Cancelled";
    else return "Completed";
  }

  statusColor(status) {
    if (status.equals(0)) return colors.green;
    else if (status.equals(1)) return colors.yellow;
    else return colors.blue;
  }

  render() {
    const { isReady, windows } = this.props.store;
    if (!isReady) return <div />; // TODO: make pretty
    return (
      <div>
        <Header />
        <Container>
          {windows.map(item => <DesktopWindow key={item.key} item={item} />)}
        </Container>
        <Hero src={hero} />
      </div>
    );
  }
}
