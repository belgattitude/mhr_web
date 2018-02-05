const path = require('path');
const webpack = require('webpack');

//const AddModuleExportsPlugin = require('add-module-exports-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "style.css",
});

module.exports = {
  devtool: 'cheap-module-source-map',
  //devtool: 'eval',
  entry: [
    'babel-polyfill',
    './src/js/index.tsx'
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
    alias: {
      // https://medium.com/@martin_hotell/type-safe-es2015-module-import-path-aliasing-with-webpack-typescript-and-jest-fe461347e010
      '@src': path.resolve(__dirname, 'src/js/'),
      '@public': path.resolve(__dirname, 'public/')
    }
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/', // for production it would be './'
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            //options: babelOptions
          },
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
      },

      {
        test: /\.(scss)$/,
        /** remove css-hot-loader for production */
        use: ['css-hot-loader'].concat(extractSass.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }]
        }))
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'ts-shader-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(mp4|m4v)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/videos/[name].[ext]',
        }
      },
      {
        test: /\.woff$|\.woff2?$|\.ttf$|\.eot$|\.otf$/,
        loader: 'file-loader',
        //use: 'url-loader?limit=10000',
        options: {
          name: 'fonts/[name].[ext]',
          /*
          publicPath: function(url) {
            return url.replace(/public/, '..')
          },*/
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=images/[name].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }

    ]
  },
  plugins: [
/*
    new webpack.EnvironmentPlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      NODE_ENV: 'production'
    }),

    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true
    }),
*/
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      hash: true,
      title: 'MHR',
      myPageHeader: 'MHR',
      template: './public/index.html',
    }),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery", // Used for Bootstrap JavaScript components
      jQuery: "jquery", // Used for Bootstrap JavaScript components
      Popper: ['popper.js', 'default'] // Used for Bootstrap dropdown, popup and tooltip JavaScript components
    }),
    extractSass,

  ],
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    port: 3001,
    historyApiFallback: true,
    hot: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
  }
};