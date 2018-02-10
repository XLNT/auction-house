import React, { Component } from "react";
import { observer, inject } from "mobx-react";

@inject("store")
@observer
export default class LoginRequired extends Component {
  render() {
    return this.props.children;
    const { currentAccount, currentNetwork } = this.props.store;
    console.log(currentAccount, currentNetwork);
    if (!currentAccount) return <div>Please login to Metamask amigo</div>;
    if (currentNetwork !== "1") return <div>Wrong network amigo</div>;
    return this.props.children;
  }
}
