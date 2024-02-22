/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const configFilePath = require.resolve("./tsconfig.json");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/** @type import('webpack').Configuration */
module.exports = {
  externals: {},
  context: __dirname,
  mode: process.env.__BUILD_ENV__ === "dev" ? "development" : "production",
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/bundle"),
    publicPath: "/",
  },
  ignoreWarnings: [/reexported/, /possible exports/],
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
          transpileOnly: true,
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
  devtool: process.env.__BUILD_ENV__ === "dev" ? "eval" : "source-map",
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
      __PORTFOLIO_POLLING_INTERVAL__: JSON.stringify(
        process.env.__PORTFOLIO_POLLING_INTERVAL__,
      ),
      __NFT_POLLING_INTERVAL__: JSON.stringify(
        process.env.__NFT_POLLING_INTERVAL__,
      ),
      __TRANSACTION_POLLING_INTERVAL__: JSON.stringify(
        process.env.__TRANSACTION_POLLING_INTERVAL__,
      ),
      __BACKUP_POLLING_INTERVAL__: JSON.stringify(
        process.env.__BACKUP_POLLING_INTERVAL__,
      ),
      __REQUEST_FOR_DATA_POLLING_INTERVAL__: JSON.stringify(
        process.env.__REQUEST_FOR_DATA_POLLING_INTERVAL__,
      ),
      __PRIMARY_INFURA_KEY__: JSON.stringify(
        process.env.__PRIMARY_INFURA_KEY__,
      ),
      __PRIMARY_RPC_PROVIDER_URL__: JSON.stringify(
        process.env.__PRIMARY_RPC_PROVIDER_URL__,
      ),
      __SECONDARY_INFURA_KEY__: JSON.stringify(
        process.env.__SECONDARY_INFURA_KEY__,
      ),
      __SECONDARY_RPC_PROVIDER_URL__: JSON.stringify(
        process.env.__SECONDARY_RPC_PROVIDER_URL__,
      ),
      __ALCHEMY_ARBITRUM_API_KEY__: JSON.stringify(
        process.env.__ALCHEMY_ARBITRUM_API_KEY__,
      ),
      __ALCHEMY_ASTAR_API_KEY__: JSON.stringify(
        process.env.__ALCHEMY_ASTAR_API_KEY__,
      ),
      __ALCHEMY_MUMBAI_API_KEY__: JSON.stringify(
        process.env.__ALCHEMY_MUMBAI_API_KEY__,
      ),
      __ALCHEMY_OPTIMISM_API_KEY__: JSON.stringify(
        process.env.__ALCHEMY_OPTIMISM_API_KEY__,
      ),
      __ALCHEMY_POLYGON_API_KEY__: JSON.stringify(
        process.env.__ALCHEMY_POLYGON_API_KEY__,
      ),
      __ALCHEMY_SOLANA_API_KEY__: JSON.stringify(
        process.env.__ALCHEMY_SOLANA_API_KEY__,
      ),
      __ALCHEMY_SOLANA_TESTNET_API_KEY__: JSON.stringify(
        process.env.__ALCHEMY_SOLANA_TESTNET_API_KEY__,
      ),
      __ALCHEMY_BASE_API_KEY__: JSON.stringify(
        process.env.__ALCHEMY_BASE_API_KEY__,
      ),
      __ETHERSCAN_ETHEREUM_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_ETHEREUM_API_KEY__,
      ),
      __ETHERSCAN_POLYGON_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_POLYGON_API_KEY__,
      ),
      __ETHERSCAN_AVALANCHE_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_AVALANCHE_API_KEY__,
      ),
      __ETHERSCAN_BINANCE_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_BINANCE_API_KEY__,
      ),
      __ETHERSCAN_MOONBEAM_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_MOONBEAM_API_KEY__,
      ),
      __ETHERSCAN_OPTIMISM_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_OPTIMISM_API_KEY__,
      ),
      __ETHERSCAN_ARBITRUM_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_ARBITRUM_API_KEY__,
      ),
      __ETHERSCAN_GNOSIS_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_GNOSIS_API_KEY__,
      ),
      __ETHERSCAN_FUJI_API_KEY__: JSON.stringify(
        process.env.__ETHERSCAN_FUJI_API_KEY__,
      ),
      __COVALENT_API_KEY__: JSON.stringify(process.env.__COVALENT_API_KEY__),
      __MORALIS_API_KEY__: JSON.stringify(process.env.__MORALIS_API_KEY__),
      __NFTSCAN_API_KEY__: JSON.stringify(process.env.__NFTSCAN_API_KEY__),
      __POAP_API_KEY__: JSON.stringify(process.env.__POAP_API_KEY__),
      __OKLINK_API_KEY__: JSON.stringify(process.env.__OKLINK_API_KEY__),
      __ANKR_API_KEY__: JSON.stringify(process.env.__ANKR_API_KEY__),
      __BLUEZ_API_KEY__: JSON.stringify(process.env.__BLUEZ_API_KEY__),
      __SPACEANDTIME_API_USERID__: JSON.stringify(
        process.env.__SPACEANDTIME_API_USERID__,
      ),
      __SPACEANDTIME_API_PRIVATEKEY__: JSON.stringify(
        process.env.__SPACEANDTIME_API_PRIVATEKEY__,
      ),
      __RARIBILE_API_KEY__: JSON.stringify(process.env.__RARIBILE_API_KEY__),
      __BLOCKVISION_API_KEY__: JSON.stringify(
        process.env.__BLOCKVISION_API_KEY__,
      ),
    }),
  ],
};
