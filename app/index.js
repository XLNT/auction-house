import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import Web3 from "web3";

window.addEventListener("load", () => {
  var web3Provided;
  if (typeof web3 !== "undefined") {
    web3Provided = new Web3(web3.currentProvider);
  } else {
    const host = process.env.RPC_HOST || "127.0.0.1";
    const port = process.env.RPC_PORT || 7545;
    web3Provided = new Web3(new Web3.providers.HttpProvider(`${host}:${port}`));
  }

  render(<App web3={web3Provided} />, document.getElementById("root"));
});
