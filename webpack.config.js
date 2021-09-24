const { resolve }             = require('path'),
      Uglify                  = require('uglifyjs-webpack-plugin'),
      autoprefixer            = require('autoprefixer'),
      MiniCssExtractPlugin    = require('mini-css-extract-plugin'),
      OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = {
  // mode: 'development',
  mode: 'production',

  entry: {
    index: resolve(__dirname, './src/js/index.js'),
    list: resolve(__dirname, './src/js/list.js'),
    query: resolve(__dirname, './src/js/query.js'),
    notFound: resolve(__dirname, './src/js/notFound.js'),
  },

  output: {
    path: resolve(__dirname, './public'),
    filename: 'js/[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [resolve(__dirname, 'node_modules')]
      },

      {
        test: /\.tpl$/,
        loader: 'ejs-loader'
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },

          'css-loader',

          {
            loader: 'postcss-loader',
            options: {
              plugin() {
                return [autoprefixer('last 5 versions')];
              }
            }
          },

          'sass-loader'
        ]
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },

          'css-loader',

          {
            loader: 'postcss-loader',
            options: {
              plugin() {
                return [autoprefixer('last 5 versions')];
              }
            }
          }
        ]
      },

      {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        loader: [
          'url-loader?limit=2048&name=images/[name]-[hash:16].[ext]'
        ]
      },

      {
        test: /\.(woff2?|eot|ttf|oft|svg)(\?.*)?$/i,
        loader: ['url-loader?name=fonts/[name].[ext]']
      }
    ]
  },

  plugins: [
    new Uglify(),
    new OptimizeCssAssetsPlugin({}),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],

  devServer: {
    watchOptions: {
      ignored: /node_modules/
    }
  }
};

module.exports = config;
