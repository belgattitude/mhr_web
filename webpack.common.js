const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = {
  entry: [
   // 'babel-polyfill',
    './src/js/index.tsx'
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      '@src': path.resolve(__dirname, 'src/js/'),
      '@public': path.resolve(__dirname, 'public/'),
      '@assets': path.resolve(__dirname, 'src/assets/')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFilename: 'tsconfig.json',
              useBabel: true,
              useCache: true,
              silent: true,
            }
          }
        ]
      }

      /* OR if we like to chain and mix js and tsx

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
        }
      }*/
      ,{
        test: /\.(glsl|vs|fs)$/,
        loader: 'ts-shader-loader'
      },{
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },{
        test: /\.(mp4|m4v|ogv|webm)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/videos/[name].[ext]',
        }
      },{
        test: /\.woff$|\.woff2?$|\.ttf$|\.eot$|\.otf$/,
        loader: 'file-loader',
        //use: 'url-loader?limit=10000',
        options: {
          name: 'fonts/[name].[ext]',
          //publicPath: function(url) {
          //  return url.replace(/public/, '..')
          //},
        },
      },
      /*
      {
        test: /\.woff$|\.woff2?$|\.ttf$|\.eot$|\.otf$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]',
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      }*/
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=images/[name]-[hash].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ]),
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
    })
  ]
};

getMinifyPlugin = function(version) {
  var minPlugin = '';
  switch (version) {
    case 'uglify_v3':
      const UglifyJsPlugin3 = require('uglifyjs-webpack-plugin');
      minPlugin = new UglifyJsPlugin3({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          comments: false,
          //ecma: 5,
          compress: true,
          warnings: true
        }
      });
      break;

    case 'minify':
      const MinifyPlugin = require("babel-minify-webpack-plugin");
      minPlugin = new MinifyPlugin({
        removeConsole: false,
        deadcode: { optimizeRawSize: true }
      }, {
        comments: false,
        sourceMap: false
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
