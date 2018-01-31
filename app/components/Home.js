import React, { Component } from "react";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      currentAccount: undefined
    };
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 100); // Ugh ಠ_ಠ
  }

  setCurrentAccount() {
    this.props.web3.eth.getAccounts((error, accounts) => {
      this.setState({ currentAccount: accounts[0] });
    });
  }

  render() {
    return (
      <div>
        <h1>Welcome home!</h1>
        <p>
          Current account:{" "}
          {this.state.currentAccount
            ? this.state.currentAccount
            : "No account found"}
        </p>
      </div>
    );
  }
}
