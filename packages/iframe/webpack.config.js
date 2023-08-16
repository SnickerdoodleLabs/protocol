/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const configFilePath = require.resolve("./tsconfig.json");
const argon2 = require("argon2");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/** @type import('webpack').Configuration */
module.exports = {
  externals: {
    argon2: argon2,
  },
  context: __dirname,
  mode: process.env.__BUILD_ENV__ === "dev" ? "development" : "production",
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/bundle"),
    publicPath: "/",
  },
  devServer: {
    https: true,
    static: {
      directory: path.join(__dirname, "./"),
    },
    historyApiFallback: true,
    liveReload: true,
    compress: true,
    port: 9005,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          projectReferences: true,
          configFile: configFilePath,
          compilerOptions: {
            noUnusedLocals: false,
            noUnusedParameters: false,
          },
        },
      },
      {
        enforce: "pre",
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, "node_modules")],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|eot|woff|woff2)$/i,
        type: "asset/resource",
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".html"],
    plugins: [new TsconfigPathsPlugin({ configFile: configFilePath })],
  },
  devtool:
    process.env.__BUILD_ENV__ === "dev" ? "eval-source-map" : "source-map",
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      favicon: "src/favicon/favicon.ico",
    }),
    new webpack.DefinePlugin({
      __CONTROL_CHAIN_ID__: JSON.stringify(process.env.__CONTROL_CHAIN_ID__),
      __IPFS_FETCH_BASE_URL__: JSON.stringify(
        process.env.__IPFS_FETCH_BASE_URL__,
      ),
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: JSON.stringify(
        process.env.__DEFAULT_INSIGHT_PLATFORM_BASE_URL__,
      ),
      __DEV_CHAIN_PROVIDER_URL__: JSON.stringify(
        process.env.__DEV_CHAIN_PROVIDER_URL__,
      ),
      __SUPPORTED_CHAINS__: JSON.stringify(process.env.__SUPPORTED_CHAINS__),
    }),
  ],
};
