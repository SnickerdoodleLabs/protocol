/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const configFilePath = require.resolve("./tsconfig.json");
const argon2 = require("argon2");
const fileSystem = require("fs-extra");

/** @type import('webpack').Configuration */
module.exports = {
  externals: {
    argon2: argon2,
  },
  context: __dirname,
  mode: process.env.__BUILD_ENV__ === "PROD" ? "production" : "development",
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
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
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
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      zlib: require.resolve("browserify-zlib"),
      assert: false,
      net: false,
      tls: false,
      fs: false,
    },
  },
  devtool: process.env.__BUILD_ENV__ === "PROD" ? false : "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      __INFURA_ID__: JSON.stringify(process.env.__INFURA_ID__),
      __CONTROL_CHAIN_NAME__: JSON.stringify(
        process.env.__CONTROL_CHAIN_NAME__ || "Local Doodle Chain",
      ),

      __CONTROL_CHAIN_ID__: JSON.stringify(
        process.env.__CONTROL_CHAIN_ID__ || "31337",
      ),
      __CONTROL_CHAIN_PROVIDER_URLS__: JSON.stringify(
        process.env.__CONTROL_CHAIN_PROVIDER_URLS__ || "http://localhost:8545",
      ),

      __CONTROL_CHAIN_METATRANSACTION_FORWARDER_ADDRESS__: JSON.stringify(
        process.env.__CONTROL_CHAIN_METATRANSACTION_FORWARDER_ADDRESS__ ||
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      ),
      __BUILD_ENV__: JSON.stringify(process.env.__BUILD_ENV__),
      __INFURA_ID__: JSON.stringify(
        process.env.__BUILD_ENV__ === "PROD"
          ? process.env.__INFURA_ID__
          : fileSystem.readJsonSync("./development.json").DEV_INFURA_ID,
      ),
      __GAPI_CLIENT_ID__: JSON.stringify(
        process.env.__BUILD_ENV__ === "PROD"
          ? process.env.__GAPI_CLIENT_ID__
          : fileSystem.readJsonSync("./development.json").DEV_GAPI_CLIENT_ID,
      ),
    }),
  ],
};
