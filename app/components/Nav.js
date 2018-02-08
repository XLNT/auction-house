import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Wrapper, Spacer, Divider } from "../styles";

@inject("store")
@observer
export default class Nav extends Component {
  get currentAccount() {
    return this.props.store.currentAccount;
  }

  render() {
    return (
      <Wrapper>
        <Spacer />
        <Link to="/">Auction List</Link>{" "}
        {this.currentAccount ? (
          <Link to="/account">{this.currentAccount}</Link>
        ) : (
          `Not logged in`
        )}, Current block: {this.props.store.currentBlock}
        <Spacer />
        <Divider />
      </Wrapper>
    );
  }
}
