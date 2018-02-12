import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "mobx-react";

import Header from "./Header";
import Home from "./Home";
import Auction from "./Auction";
import About from "./About";
import AuctionList from "./AuctionList";
import MetamaskRequired from "./MetamaskRequired";

export default class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div>
            <Header />
            <Route
              path="/auction/:auctionId"
              component={props => (
                <MetamaskRequired>
                  <Auction {...props} />
                </MetamaskRequired>
              )}
            />
            <Route path="/auctions" component={AuctionList} />
            <Route exact path="/about" component={About} />
            <Route exact path="/" component={Home} />
          </div>
        </Router>
      </Provider>
    );
  }
}
