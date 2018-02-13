import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Link } from "react-router-dom";
import styled from "react-emotion";
import {
  Wrapper,
  Spacer,
  Divider,
  headerHeight,
  basePadding,
  colors,
  FloatRight
} from "../styles";
import logo from "../images/logo-blue.svg";

const HeaderContainer = styled("div")`
  height: ${headerHeight}px;
  width: 100%;
  padding: ${basePadding}px;
`;

const HeaderLink = styled(Link)`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 300;
  line-height: ${headerHeight - 2 * basePadding}px;
  display: inline-block;
`;

const Logo = styled(Link)`
  cursor: pointer;
  height: ${headerHeight - 2 * basePadding}px;
  display: inline-block;
  & img {
    height: 100%;
  }
`;

@inject("store")
@observer
export default class Header extends Component {
  render() {
    return (
      <HeaderContainer>
        <Logo to="/">
          <img src={logo} />
        </Logo>

        <FloatRight>
          <HeaderLink to="/auctions">Auctions</HeaderLink>
          <Spacer inline />
          <HeaderLink to="/about">About</HeaderLink>
        </FloatRight>
      </HeaderContainer>
    );
  }
}
