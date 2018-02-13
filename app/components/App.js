import React, { Component } from "react";
import { Router, matchPath } from "react-router-dom";
import { Provider } from "mobx-react";
import createHistory from "history/createBrowserHistory";
import Auction from "./Auction";
import About from "./About";
import AuctionList from "./AuctionList";
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
      () => {
        this.addAuctionsWindow();
      }
    ],
    [
      "/about",
      () => {
        this.addAboutWindow();
      }
    ],
    [
      "/",
      () => {
        this.addAuctionWindow(0);
      }
    ]
  ];

  componentDidMount() {
    this.handleRouteChange(this.history.location);
    this.unlisten = this.history.listen(location => {
      this.handleRouteChange(location);
    });
  }

  handleRouteChange(location) {
    this.routes.forEach(route => {
      const [path, callback] = route;
      const match = matchPath(location.pathname, { path, exact: true });
      if (match) callback(match);
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
