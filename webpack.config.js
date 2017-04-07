/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var path = require('path');
var webpack = require('webpack');

var babelOptions = {
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ],
    "es2016"
  ]
};

module.exports = {
  cache: true,
  entry: {
    main: './src/app/main.ts',

    // common dependencies bundled together packaged with CommonsChunkPlugin in gulp/webpack.js
    vendor: [
      'babel-polyfill',
      'angular',
      'angular-animate',
      'angular-ui-bootstrap',
      'angular-ui-router'
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist/scripts'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions
        },
        {
          loader: 'ts-loader'
        }
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions
        }
      ]
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'raw-loader'
    }]
  },
  plugins: [ // Check gulp/webpack.js for build specific plugins
    new webpack.ProvidePlugin({
      "window.jQuery": "jquery"
    })
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
};
