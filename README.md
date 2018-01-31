# react-es6-truffle-webpack-boilerplate

A super lightweight boilerplate using react, es6, truffle, and webpack.

### Getting started

Start a local blockchain like [Ganache](https://github.com/trufflesuite/ganache). You can use [Ganache CLI](https://github.com/trufflesuite/ganache-cli) or the [desktop client](http://truffleframework.com/ganache/).

```
ganache-cli
```
Add an `.env` file depending on which port ganache is running on and which port you want your server running on.
```
// .env
PORT=5000
TRUFFLE_HOST="127.0.0.1"
TRUFFLE_PORT=7545
```

Compile and migrate your local smart contracts.

```
truffle compile
truffle migrate --reset
```

Install packages and start server (I prefer using [yarn](https://yarnpkg.com/en/))
```
yarn
yarn start
```
