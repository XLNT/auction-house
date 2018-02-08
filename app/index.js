import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./components/App";
import Store from "./store";
import Web3 from "web3";
import "./styles/global";

const render = (Component, props) => {
  ReactDOM.render(
    <AppContainer warnings={false}>
      <Component {...props} />
    </AppContainer>,
    document.getElementById("root")
  );
};

let web3Provided;
let store;

window.onload = () => {
  if (typeof web3 !== "undefined") {
    web3Provided = new Web3(web3.currentProvider);
  } else {
    const host = process.env.RPC_HOST || "127.0.0.1";
    const port = process.env.RPC_PORT || 7545;
    web3Provided = new Web3(new Web3.providers.HttpProvider(`${host}:${port}`));
  }

  store = new Store(web3Provided);

  render(App, { store });
};

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./components/App", () => {
    render(App, { store });
  });

  module.hot.accept("./styles/global", () => {
    render(App, { store });
  });
}
