import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "mobx-react";
import Nav from "./Nav";
import AuctionList from "./AuctionList";
import Auction from "./Auction";

export default class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div>
            <Nav />
            <Route path="/auction/:auctionUid" component={Auction} />
            <Route exact path="/" component={AuctionList} />
          </div>
        </Router>
      </Provider>
    );
  }
}
