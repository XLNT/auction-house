const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
        RPC_PORT: JSON.stringify(process.env.RPC_PORT),
        STAGE: JSON.stringify(process.env.STAGE),
        WEB3_PROVIDER: JSON.stringify(process.env.WEB3_PROVIDER)
      }
    }),
    new CopyWebpackPlugin([{ from: "app/images/favicon.ico" }])
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
      },
      {
        test: /\.(ico|png|jpe?g|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "[name].[ext]"
          }
        }
      }
    ]
  }
};
