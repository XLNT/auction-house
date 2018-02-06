# marketplace 🤝

Bare bones auction client. Use the `AuctionFactory` to create auctions and place bids.

### Getting started

Start a local blockchain like [Ganache](https://github.com/trufflesuite/ganache). You can use [Ganache CLI](https://github.com/trufflesuite/ganache-cli) or the [desktop client](http://truffleframework.com/ganache/).

```
ganache-cli
```

Add an `.env` file depending on which port ganache is running on and which port you want your server running on.

```
// .env
PORT=5000
RPC_HOST="127.0.0.1"
RPC_PORT=8545
```

Compile and migrate your local smart contracts.

```
truffle migrate --reset
```

Install packages and start server (I prefer using [yarn](https://yarnpkg.com/en/))

```
yarn
yarn start
```

To add an ERC721 CryptoHill to account index 1 on ganache, run :

```
node script.js
```

This will add one CryptoHill, and open up a repl. You can add more hills by running this command in the repl:

```
hillCore.createPromoHill(1, 1, 1, acct1, {
  from: acct0,
  gas: 1000000
});
```
