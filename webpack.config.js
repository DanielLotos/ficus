const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd
    ? 'production'
    : 'development',

  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        })
      },
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },

  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: './src/index.pug'
  //   }),
  //   new ExtractTextPlugin('style.css')
  // ],
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    }),
    new HtmlWebpackPlugin({
      filename: 'brief.html',
      template: './src/brief.pug'
    }),
    new ExtractTextPlugin('style.css')
  ],

  devServer: {
    inline: true,
    port: 3000,
    hot: true,
    noInfo: true,
    overlay: true,
    open: true,
    publicPath: '/'
  }
};

