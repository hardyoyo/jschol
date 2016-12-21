const webpack = require("webpack");
const _ = require('lodash');

///////////////////////////////////////////////////////////////////////////////////////////////////
// read package.json and get dependencies' package ids
function getNPMPackageIds() {
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {
    // does not have a package.json manifest
  }
  return _.keys(packageManifest.dependencies) || [];
}

module.exports = {
  entry: {
    app: './app/jsx/App.jsx',
    lib: getNPMPackageIds()
  },
  output: {
    filename: '[name]-bundle.js',
    path: './app/js',
    publicPath: "/js/"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("lib")
  ],
  module: {
    loaders: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  performance : {
    hints : false
  },
  devtool: "cheap-module-source-map" // dev only
}