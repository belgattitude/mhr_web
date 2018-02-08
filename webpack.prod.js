const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
const common = require('./webpack.common.js');


const extractSass = new ExtractTextPlugin({
  filename: "style.css",
});

getMinifyPlugin = function(version) {
  var minPlugin = '';
  switch (version) {
    case 'uglify_v1':
      const UglifyJsPlugin1 = require('uglifyjs-webpack-plugin');
      minPlugin = new UglifyJsPlugin1({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          comments: false,
          ecma: 5,
          compress: true,
          warnings: true
        }
      });
      break;

    default:
      // Bundled webpack uglify
      minPlugin = new webpack.optimize.UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        compress: {
          warnings: true
        },
        output: {
          comments: false
        }
      });
  }
  return minPlugin;
};


module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }]
        })
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      NODE_ENV: JSON.stringify('production')
    }),


    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    /*
    new PrepackWebpackPlugin({}),
*/
    getMinifyPlugin('uglify_v1'),

    extractSass,

  ],

  devtool: false
});


