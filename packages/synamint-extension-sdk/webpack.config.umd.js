const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg"];
const configFilePath = require.resolve("./tsconfig.json");

module.exports = {
  target: "webworker",
  mode: "production",
  devtool: false,
  entry: {
    "lib/core": path.resolve(__dirname, "src/core/index.ts"),
    "lib/contentjs": path.resolve(__dirname, "src/content/index.tsx"),
    "injectables/dataWalletProxy": path.join(
      __dirname,
      "src",
      "content",
      "injectables",
      "dataWalletProxy.ts",
    ),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    library: "sdl-extension-[name]",
    libraryTarget: "umd",
    clean: true,
    chunkFilename: "chunks/chunk.[name].bundle.js",
  },
  externals: {
    ethers: "ethers",
    // "@snickerdoodlelabs/objects": "@snickerdoodlelabs/objects",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-syntax-import-assertions"],
          },
        },
      },
      {
        test: /\.(tsx)$/,
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
    ],
  },
  infrastructureLogging: {
    level: "info",
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "types/**/*",
          to: "./",
          force: true,
        },
      ],
    }),
  ],
  resolve: {
    plugins: [new TsconfigPathsPlugin({ configFile: configFilePath })],
    extensions: fileExtensions
      .map((extension) => "." + extension)
      .concat([".js", ".jsx", ".ts", ".tsx", ".css"]),
  },
};
