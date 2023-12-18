/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const DeadCodePlugin = require("webpack-deadcode-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const configFilePath = require.resolve("./tsconfig.json");

module.exports = {
  context: __dirname,
  mode: process.env.__BUILD_ENV__ === "dev" ? "development" : "production",
  entry: path.join(__dirname, "src/Render.tsx"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/bundle"),
    publicPath: "/",
    pathinfo: !(process.env.__BUILD_ENV__ === "dev"),
  },
  devServer: {
    https: true,
    static: {
      directory: path.join(__dirname, "./"),
    },
    historyApiFallback: true,
    liveReload: true,
    port: 9005,
    devMiddleware: {},
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: process.env.__BUILD_ENV__ === "dev",
          projectReferences: !(process.env.__BUILD_ENV__ === "dev"),
          configFile: configFilePath,
        },
      },
      {
        enforce: "pre",
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|eot|woff|woff2)$/i,
        type: "asset/resource",
        exclude: /node_modules/,
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
        exclude: /node_modules/,
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

  ignoreWarnings: [/reexported/],

  devtool: process.env.__BUILD_ENV__ === "dev" ? "eval" : "source-map",
  plugins: [
    // new DeadCodePlugin({
    //   patterns: ["src/**/*.(png|gif|jpg|svg|ttf|woff|woff2)"],
    // }),
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
