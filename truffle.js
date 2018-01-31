require("dotenv").config();
const host = process.env.TRUFFLE_HOST || "127.0.0.1";
const port = process.env.TRUFFLE_PORT || 8545;

module.exports = {
  networks: {
    development: {
      host: host,
      port: port,
      network_id: "*" // match any network
    }
  }
};
