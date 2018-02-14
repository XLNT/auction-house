import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "react-emotion";
import hero from "../images/Miriam.jpg";
import Header from "./Header";
import DesktopWindow from "./DesktopWindow";
import AuctionImage from "./AuctionImage";

const Container = styled("div")`
  position: relative;
`;

@inject("store")
@observer
export default class Desktop extends Component {
  render() {
    const { isReady, windows } = this.props.store;
    if (!isReady) return <div />; // TODO: make pretty
    return (
      <div>
        <Header />
        <Container>
          {windows.map(item => <DesktopWindow key={item.key} item={item} />)}
        </Container>
        <AuctionImage />
      </div>
    );
  }
}
