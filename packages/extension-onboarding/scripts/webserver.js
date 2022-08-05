// These values are appropriate for Local environment
process.env.__BUILD_ENV__ = "dev";
process.env.__INFURA_ID__ = "72827ccd538446f2a20e35a632664c52";
process.env.__CONTROL_CHAIN_NAME__ = "Local Doodle Chain";
process.env.__CONTROL_CHAIN_ID__ = 31338;
process.env.__CONTROL_CHAIN_PROVIDER_URLS__ = "http://127.0.0.1:8545";
process.env.__CONTROL_CHAIN_METATRANSACTION_FORWARDER_ADDRESS__ =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
process.env.__GAPI_CLIENT_ID__ =
  "332580693256-mifj8rkovvlc332n8gtllpdl93e6nvio.apps.googleusercontent.com";

var WebpackDevServer = require("webpack-dev-server"),
  webpack = require("webpack"),
  config = require("../webpack.config"),
  path = require("path");

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || [],
);

var compiler = webpack(config);

var server = new WebpackDevServer(
  {
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
  compiler,
);

if (module.hot) {
  module.hot.accept();
}

(async () => {
  await server.start();
})();
