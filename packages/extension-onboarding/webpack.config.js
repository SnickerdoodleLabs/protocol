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
  devtool:
    process.env.__BUILD_ENV__ === "dev" ? "eval-source-map" : "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      favicon: "src/favicon/favicon.ico",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      __BUILD_ENV__: JSON.stringify(process.env.__BUILD_ENV__),
      __INFURA_ID__: JSON.stringify(process.env.__INFURA_ID__),
      __GAPI_CLIENT_ID__: JSON.stringify(process.env.__GAPI_CLIENT_ID__),
      __GA_TRACKING_ID__: JSON.stringify(process.env.__GA_TRACKING_ID__),
      __IPFS_FETCH_BASE_URL__: JSON.stringify(
        process.env.__IPFS_FETCH_BASE_URL__,
      ),
      __HOTJAR_ID__: JSON.stringify(process.env.__HOTJAR_ID__),
      __HOTJAR_SNIPPET_VERSION__: JSON.stringify(
        process.env.__HOTJAR_SNIPPET_VERSION__,
      ),
      __PRIMARY_INFURA_KEY__: JSON.stringify(
        process.env.__PRIMARY_INFURA_KEY__,
      ),
      __IFRAME_URL__: JSON.stringify(process.env.__IFRAME_URL__),
      __GOOGLE_CLOUD_BUCKET__: JSON.stringify(
        process.env.__GOOGLE_CLOUD_BUCKET__ || "",
      ),
    }),
  ],
};
