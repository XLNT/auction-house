# marketplace 🤝

Bare bones auction client. Use the `AuctionBase` to create auctions and place bids.

### Getting started

Install packages and start server (I prefer using [yarn](https://yarnpkg.com/en/))

```
yarn
yarn start
```

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
STAGE="development"
```

Compile and migrate your local smart contracts (both [auction-contracts](https://github.com/xlnt/auction-contracts) and [curator-contracts](https://github.com/xlnt/curator-contracts))

You can add curator assets and create auctions by using [auction-admin](https://github.com/xlnt/auction-admin).
