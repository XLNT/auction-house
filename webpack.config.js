const webpack = require("webpack");
const path = require("path");
const port = process.env.PORT || 3000;

module.exports = {
  entry: [
    "webpack-dev-server/client?http://localhost:" + port,
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
    new webpack.NoErrorsPlugin()
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
  },
  node: {
    fs: "empty"
  }
};
