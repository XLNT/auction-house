const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: [
    "webpack-dev-server/client?http://localhost:" + (process.env.PORT || 3000),
    "webpack/hot/dev-server",
    "./app/index"
  ],
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/static/"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  devtool: "eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        PORT: JSON.stringify(process.env.PORT),
        RPC_HOST: JSON.stringify(process.env.RPC_HOST),
        RPC_PORT: JSON.stringify(process.env.RPC_PORT)
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ["babel"],
        include: path.join(__dirname, "app")
      },
      {
        test: /\.json?$/,
        loaders: ["json-loader"]
      }
    ]
  }
};
