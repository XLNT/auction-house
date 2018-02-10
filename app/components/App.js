import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "mobx-react";
import Nav from "./Nav";
import Account from "./Account";
import AuctionList from "./AuctionList";
import Auction from "./Auction";
import AccountLogin from "./AccountLogin";

export default class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div>
            <Nav />
            <Route
              path="/account"
              component={props => (
                <AccountLogin>
                  <Account {...props} />
                </AccountLogin>
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
