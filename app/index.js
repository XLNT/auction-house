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

let store;

window.onload = () => {
  const readOnlyWeb3Provider = process.env.WEB3_PROVIDER
    ? new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER))
    : new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  const writeOnlyWeb3Provider =
    typeof global.web3 !== "undefined"
      ? new Web3(global.web3.currentProvider)
      : undefined;

  console.log(readOnlyWeb3Provider.currentProvider);
  console.log(writeOnlyWeb3Provider.currentProvider);

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
