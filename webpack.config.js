const webpack = require("webpack");
const path = require("path");

module.exports = {
  context: __dirname,
  entry: [
    "babel-polyfill",
    "react-hot-loader/patch",
    "./app/index.js",
    "webpack-hot-middleware/client"
  ],
  output: {
    filename: "bundle.js",
    path: __dirname,
    publicPath: "/"
  },
  devtool: "eval-source-map",
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        PORT: JSON.stringify(process.env.PORT),
        RPC_HOST: JSON.stringify(process.env.RPC_HOST),
        RPC_PORT: JSON.stringify(process.env.RPC_PORT)
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.json?$/,
        loaders: ["json-loader"]
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  }
};
