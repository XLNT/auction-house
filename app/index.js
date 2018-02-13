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
  const host = process.env.RPC_HOST || "127.0.0.1";
  const port = process.env.RPC_PORT || 7545;

  const readOnlyWeb3Provider = process.env.WEB3_PROVIDER
    ? new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER))
    : new Web3(new Web3.providers.HttpProvider(`${host}:${port}`));
  const writeOnlyWeb3Provider =
    typeof web3 !== "undefined" ? new Web3(web3.currentProvider) : undefined;

  store = new Store(readOnlyWeb3Provider, writeOnlyWeb3Provider);

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
