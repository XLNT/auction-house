import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" render={() => <Home web3={this.props.web3} />} />
      </Router>
    );
  }
}
