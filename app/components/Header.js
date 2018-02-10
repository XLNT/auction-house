import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import {
  Wrapper,
  Spacer,
  Divider,
  headerHeight,
  basePadding,
  colors,
  FloatRight
} from "../styles";
import styled from "react-emotion";
import logo from "../images/logo.png";

const HeaderContainer = styled("div")`
  box-sizing: border-box;
  height: ${headerHeight}px;
  width: 100%;
  line-height: ${headerHeight - 2 * basePadding}px;
  background-color: ${colors.grey};
`;

const HeaderText = styled("span")`
  display: inline-block;
  padding: ${basePadding}px 0;
  margin: 0 0 0 ${basePadding}px;
  & a {
    color: ${colors.black};
  }
  & a:hover {
    text-decoration: none;
    color: black;
  }
`;

const Logo = styled("div")`
  cursor: pointer;
  box-sizing: border-box;
  height: ${headerHeight - 1}px;
  display: inline-block;
  & img {
    height: ${headerHeight - basePadding * 1 - 1}px;
  }
  padding: ${basePadding * 0.5}px 0;
`;

@inject("store")
@observer
export default class Header extends Component {
  get currentAccount() {
    return this.props.store.currentAccount;
  }

  render() {
    return (
      <HeaderContainer>
        <Wrapper>
          <Logo>
            <Link to="/">
              <img src={logo} />
            </Link>
          </Logo>

          <FloatRight>
            <HeaderText>
              <Link to="/invite">Invite</Link>
            </HeaderText>

            <HeaderText>
              <Link to="/about">About</Link>
            </HeaderText>

            <HeaderText>
              <Link to="/faqs">FAQs</Link>
            </HeaderText>
          </FloatRight>
        </Wrapper>
      </HeaderContainer>
    );
  }
}
