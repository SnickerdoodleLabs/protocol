const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fileSystem = require("fs-extra");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const env = require("./utils/env");

const configFilePath = require.resolve("./tsconfig.json");
const argon2 = require("argon2");

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

var options = {
  externals: {
    argon2: argon2,
  },
  mode: process.env.NODE_ENV || "development",
  entry: {
    newtab: path.join(__dirname, "src", "app", "Newtab", "index.jsx"),
    options: path.join(__dirname, "src", "app", "Options", "index.jsx"),
    popup: path.join(__dirname, "src", "app", "Popup", "index.jsx"),
    background: path.join(__dirname, "src", "extensionCore", "index.ts"),
    contentScript: path.join(__dirname, "src", "app", "Content", "index.js"),
    "injectables/onboarding": path.join(
      __dirname,
      "src",
      "app",
      "Content",
      "injectables",
      "onboarding.ts",
    ),
    devtools: path.join(__dirname, "src", "app", "Devtools", "index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    publicPath: process.env.ASSET_PATH,
  },
  module: {
    rules: [
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
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
        exclude: /node_modules/,
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
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "source-map-loader",
          },
          {
            loader: "babel-loader",
          },
        ],
        exclude: /node_modules/,
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
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new webpack.DefinePlugin({
      __ONBOARDING_URL__: JSON.stringify(process.env.__ONBOARDING_URL__),
      __ACCOUNT_COOKIE_URL__: JSON.stringify(
        process.env.__ACCOUNT_COOKIE_URL__,
      ),
      __MANIFEST_VERSION__: JSON.stringify(
        process.env.__MANIFEST_VERSION__ || "v3",
      ),
      __PLATFORM__: JSON.stringify(process.env.__PLATFORM__ || "chrome"),
      __CONTROL_CHAIN_ID__: JSON.stringify(process.env.__CONTROL_CHAIN_ID__),
      __SUPPORTED_CHAINS__: JSON.stringify(process.env.__SUPPORTED_CHAINS__),
      __IPFS_FETCH_BASE_URL__: JSON.stringify(
        process.env.__IPFS_FETCH_BASE_URL__,
      ),
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: JSON.stringify(
        process.env.__DEFAULT_INSIGHT_PLATFORM_BASE_URL__,
      ),
      __COVALENT_API_KEY__: JSON.stringify(process.env.__COVALENT_API_KEY__),
      __MORALIS_API_KEY__: JSON.stringify(process.env.__MORALIS_API_KEY__),
      __DNS_SERVER_ADDRESS__: JSON.stringify(
        process.env.__DNS_SERVER_ADDRESS__,
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
                  {
                    ...((process.env.__MANIFEST_VERSION__ || "v3") === "v3"
                      ? {
                          host_permissions: [
                            process.env.__ACCOUNT_COOKIE_URL__,
                          ],
                        }
                      : { permissions: [process.env.__ACCOUNT_COOKIE_URL__] }),
                  },
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
          from: "src/app/Content/content.styles.css",
          to: path.join(__dirname, "build"),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/app/Content/injectables",
          to: path.join(__dirname, "build", "injectables"),
          force: true,
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "app", "Newtab", "index.html"),
      filename: "newtab.html",
      chunks: ["newtab"],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "app", "Options", "index.html"),
      filename: "options.html",
      chunks: ["options"],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "app", "Popup", "index.html"),
      filename: "popup.html",
      chunks: ["popup"],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "app", "Devtools", "index.html"),
      filename: "devtools.html",
      chunks: ["devtools"],
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
