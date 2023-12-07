/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

// const argon2 = require("argon2");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fileSystem = require("fs-extra");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const env = require("./utils/env.cjs");

const configFilePath = require.resolve("./tsconfig.json");

var alias = {
  "react-dom": "@hot-loader/react-dom",
};

// load the secrets
var secretsPath = path.join(__dirname, "secrets." + env.NODE_ENV + ".js");

var fileExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "eot",
  "otf",
  "svg",
  "ttf",
  "woff",
  "woff2",
];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

console.log(`env.NODE_ENV: ${env.NODE_ENV}`);

var options = {
  externals: {
    // argon2: argon2,
  },
  target: "webworker",
  // mode: env.NODE_ENV || "development",
  mode: "development",
  entry: {
    popup: path.join(__dirname, "src", "popup", "index.tsx"),
    background: path.join(__dirname, "src", "background", "index.ts"),
    contentScript: path.join(__dirname, "src", "content", "index.ts"),
    dataWalletProxy: path.join(
      __dirname,
      "src",
      "injectables",
      "dataWalletProxy.ts",
    ),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    publicPath: process.env.ASSET_PATH,
    ...(env.NODE_ENV === "development"
      ? { chunkFilename: "chunk.[name].bundle.js" }
      : {}),
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          projectReferences: true,
          configFile: configFilePath,
          compilerOptions: {
            // build still catches these. avoid them during bunding time for a nicer dev experience.
            noUnusedLocals: false,
            noUnusedParameters: false,
          },
        },
      },
    ],
  },
  resolve: {
    alias: alias,
    plugins: [new TsconfigPathsPlugin({ configFile: configFilePath })],
    extensions: fileExtensions
      .map((extension) => "." + extension)
      .concat([".js", ".jsx", ".ts", ".tsx", ".css", "html"]),
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CleanWebpackPlugin({ verbose: true }),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      __ONBOARDING_URL__: JSON.stringify(process.env.__ONBOARDING_URL__),
      __MANIFEST_VERSION__: JSON.stringify(
        process.env.__MANIFEST_VERSION__ || "v3",
      ),
      __GOOGLE_CLOUD_BUCKET__: JSON.stringify(
        process.env.__GOOGLE_CLOUD_BUCKET__ || "ceramic-replacement-bucket",
      ),
      __DROPBOX_APP_KEY__: JSON.stringify(
        process.env.__DROPBOX_APP_KEY__ || "",
      ),
      __DROPBOX_APP_SECRET__: JSON.stringify(
        process.env.__DROPBOX_APP_SECRET__ || "",
      ),
      __DROPBOX_REDIRECT_URI__: JSON.stringify(
        process.env.__DROPBOX_REDIRECT_URI__ || "",
      ),
      __PLATFORM__: JSON.stringify(process.env.__PLATFORM__ || "chrome"),
      __CONTROL_CHAIN_ID__: JSON.stringify(process.env.__CONTROL_CHAIN_ID__),
      __IPFS_FETCH_BASE_URL__: JSON.stringify(
        process.env.__IPFS_FETCH_BASE_URL__,
      ),
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: JSON.stringify(
        process.env.__DEFAULT_INSIGHT_PLATFORM_BASE_URL__,
      ),
      __REQUEST_FOR_DATA_EVENT_FREQ__: JSON.stringify(
        process.env.__REQUEST_FOR_DATA_EVENT_FREQ__,
      ),
      /* ALCHEMY API KEYS to PASS IN */
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

      /* ETHERSCAN KEYS PASSED IN */
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
      __SPACEANDTIME_API_PUBLICKEY__: JSON.stringify(
        process.env.__SPACEANDTIME_API_PUBLICKEY__,
      ),
      __SPACEANDTIME_API_PRIVATEKEY__: JSON.stringify(
        process.env.__SPACEANDTIME_API_PRIVATEKEY__,
      ),
      __RARIBILE_API_KEY__: JSON.stringify(process.env.__RARIBILE_API_KEY__),
      __BLOCKVISION_API_KEY__: JSON.stringify(
        process.env.__BLOCKVISION_API_KEY__,
      ),
      __PRIMARY_INFURA_KEY__: JSON.stringify(
        process.env.__PRIMARY_INFURA_KEY__,
      ),
      __SECONDARY_INFURA_KEY__: JSON.stringify(
        process.env.__SECONDARY_INFURA_KEY__,
      ),

      /* END */

      __DNS_SERVER_ADDRESS__: JSON.stringify(
        process.env.__DNS_SERVER_ADDRESS__,
      ),
      __DOMAIN_FILTER__: JSON.stringify(process.env.__DOMAIN_FILTER__),
      __PORTFOLIO_POLLING_INTERVAL__: JSON.stringify(
        process.env.__PORTFOLIO_POLLING_INTERVAL__,
      ),
      __TRANSACTION_POLLING_INTERVAL__: JSON.stringify(
        process.env.__TRANSACTION_POLLING_INTERVAL__,
      ),
      __BACKUP_POLLING_INTERVAL__: JSON.stringify(
        process.env.__BACKUP_POLLING_INTERVAL__,
      ),
      __ENABLE_BACKUP_ENCRYPTION__: JSON.stringify(
        process.env.__ENABLE_BACKUP_ENCRYPTION__,
      ),
      __DISCORD_CLIENT_ID__: JSON.stringify(process.env.__DISCORD_CLIENT_ID__),
      __DISCORD_CLIENT_KEY__: JSON.stringify(
        process.env.__DISCORD_CLIENT_KEY__,
      ),
      __DISCORD_POLL_INTERVAL__: JSON.stringify(
        process.env.__DISCORD_POLL_INTERVAL__,
      ),
      __TWITTER_CONSUMER_KEY__: JSON.stringify(
        process.env.__TWITTER_CONSUMER_KEY__,
      ),
      __TWITTER_CONSUMER_SECRET__: JSON.stringify(
        process.env.__TWITTER_CONSUMER_SECRET__,
      ),
      __TWITTER_POLL_INTERVAL__: JSON.stringify(
        process.env.__TWITTER_POLL_INTERVAL__,
      ),
      __PRIMARY_INFURA_KEY__: JSON.stringify(
        process.env.__PRIMARY_INFURA_KEY__,
      ),
      __DEV_CHAIN_PROVIDER_URL__: JSON.stringify(
        process.env.__DEV_CHAIN_PROVIDER_URL__,
      ),
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: `./src/manifest/${
            process.env.__MANIFEST_VERSION__ || "v3"
          }/base.json`,
          to: path.join(__dirname, "build/manifest.json"),
          force: true,
          transform: function (content, path) {
            return Buffer.from(
              JSON.stringify(
                merge(
                  JSON.parse(content.toString()),
                  fileSystem.readJSONSync(
                    `./src/manifest/${
                      process.env.__MANIFEST_VERSION__ || "v3"
                    }/${process.env.__PLATFORM__ || "chrome"}.json`,
                  ),
                ),
              ),
            );
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/assets",
          to: path.join(__dirname, "build", "assets"),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/offscreen",
          to: path.join(__dirname, "build", "offscreen"),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "index.html"),
      filename: "popup.html",
      chunks: ["popup"],
      cache: false,
    }),
  ],
  infrastructureLogging: {
    level: "info",
  },
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-source-map";
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
