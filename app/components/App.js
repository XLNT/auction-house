import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "mobx-react";

import Header from "./Header";
import Account from "./Account";
import AuctionList from "./AuctionList";
import Auction from "./Auction";
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
            <Route exact path="/" component={AuctionList} />
          </div>
        </Router>
      </Provider>
    );
  }
}
