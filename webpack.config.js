const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',

    entry: './src/js/index.js',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      clean: true,
      publicPath: isProduction ? '/INIS5Frontend/' : '',
    },

    devServer: {
      static: './dist',
      hot: true,
      port: 3000,
      open: true,
    },

    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext][query]',
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),

      ...(isProduction
        ? [
          new MiniCssExtractPlugin({
            filename: './styles/[name].[contenthash].css',
          }),
        ]
        : []),
    ],

    optimization: {
      minimize: isProduction,

      minimizer: isProduction
        ? [
          '...',
          new CssMinimizerPlugin({
            minimizerOptions: {
              preset: ['default', { discardComments: { removeAll: true } }],
            },
          }),
        ]
        : [],
    },

    resolve: {
      extensions: ['.js', '.json'],
    },
  };
};