import React, { Component } from "react";
import { Router, Route, matchPath } from "react-router-dom";
import { action } from "mobx";
import { Provider, observer } from "mobx-react";
import createHistory from "history/createBrowserHistory";
import Header from "./Header";
import Auction from "./Auction";
import About from "./About";
import AuctionList from "./AuctionList";
import MetamaskRequired from "./MetamaskRequired";
import Desktop from "./Desktop";

export default class App extends Component {
  history = createHistory();
  routes = [
    [
      "/auction/:auctionId",
      match => {
        this.addAuctionWindow(match.params.auctionId);
      }
    ],
    [
      "/auctions",
      match => {
        this.addAuctionsWindow();
      }
    ],
    [
      "/about",
      match => {
        this.addAboutWindow();
      }
    ],
    [
      "/",
      match => {
        this.addAuctionWindow(0);
      }
    ]
  ];

  componentDidMount() {
    this.handleRouteChange(this.history.location);
    this.unlisten = this.history.listen((location, action) => {
      this.handleRouteChange(location);
    });
  }

  handleRouteChange(location) {
    this.routes.forEach(route => {
      const [path, callback] = route;
      const match = matchPath(location.pathname, { path, exact: true });
      if (match) {
        callback(match);
        return;
      }
    });
  }

  addAuctionWindow(id) {
    const newWindow = {
      key: `auction/${id}`,
      component: Auction,
      props: { auctionId: id }
    };
    this.props.store.addWindow(newWindow);
  }

  addAuctionsWindow() {
    const newWindow = { key: "auctions", component: AuctionList };
    this.props.store.addWindow(newWindow);
  }

  addAboutWindow() {
    const newWindow = { key: "about", component: About };
    this.props.store.addWindow(newWindow);
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={this.history}>
          <Desktop />
        </Router>
      </Provider>
    );
  }
}
