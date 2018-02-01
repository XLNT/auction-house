require("dotenv").config();

module.exports = {
  networks: {
    development: {
      host: process.env.RPC_HOST || "127.0.0.1",
      port: process.env.RPC_PORT || 8545,
      network_id: "*" // match any network
    }
  }
};
