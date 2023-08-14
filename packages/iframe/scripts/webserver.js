process.env.__BUILD_ENV__ = "prod";
process.env.__CONTROL_CHAIN_ID__ = "43113";
process.env.__DEFAULT_INSIGHT_PLATFORM_BASE_URL__ =
  "https://insight-api.snickerdoodle.com/v0/";
process.env.__IPFS_FETCH_BASE_URL__ =
  "https://ipfs-gateway.snickerdoodle.com/ipfs/";

process.env.__SUPPORTED_CHAINS__ =
  "1,43113,43114,137,-1,100,56,1284,42161,592,31337";

process.env.__DEV_CHAIN_PROVIDER_URL__ = "";
var WebpackDevServer = require("webpack-dev-server"),
  webpack = require("webpack"),
  config = require("../webpack.config"),
  path = require("path");

var compiler = webpack(config);

var server = new WebpackDevServer(
  {
    https: false,
    static: {
      directory: path.join(__dirname, "./"),
    },
    historyApiFallback: true,
    liveReload: true,
    compress: true,
    port: 9010,
    devMiddleware: {
      writeToDisk: false,
    },
  },
  compiler,
);

(async () => {
  await server.start();
})();
