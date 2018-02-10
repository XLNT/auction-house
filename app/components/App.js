import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "mobx-react";

import Account from "./Account";
import Header from "./Header";
import AuctionList from "./AuctionList";
import Auction from "./Auction";
import About from "./About";
import LoginRequired from "./LoginRequired";

export default class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div>
            <Header />
            <Route
              path="/account"
              component={props => (
                <LoginRequired>
                  <Account {...props} />
                </LoginRequired>
              )}
            />
            <Route path="/auction/:auctionId" component={Auction} />
            <Route exact path="/about" component={About} />
            <Route exact path="/" component={AuctionList} />
          </div>
        </Router>
      </Provider>
    );
  }
}
