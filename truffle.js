require("dotenv").config();
const host = process.env.RPC_HOST || "127.0.0.1";
const port = process.env.RPC_PORT || 8545;

module.exports = {
  networks: {
    development: {
      host: host,
      port: port,
      network_id: "*" // match any network
    }
  }
};
