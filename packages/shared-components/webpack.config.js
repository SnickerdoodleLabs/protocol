/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const configFilePath = require.resolve("./tsconfig.json");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  externals: {},
  context: __dirname,
  mode: process.env.__BUILD_ENV__ === "dev" ? "development" : "production",
  entry: path.join(__dirname, "src/Playground.tsx"),
  output: {
    filename: "playground.js",
    path: path.join(__dirname, "/dist/bundle"),
    publicPath: "/",
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
      template: path.join(__dirname, "index.html"),
    }),
  ],
};
