var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: "./client/index.js",
  output: {
    path: path.join(__dirname, "_build/client"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".jsx", ".js"]
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: "babel"
    }]
  },
  plugins: process.env.NODE_ENV === "production" ? [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    })
  ] : []
};
