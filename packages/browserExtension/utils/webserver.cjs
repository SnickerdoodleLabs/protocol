// These values are appropriate for Local environment
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
process.env.ASSET_PATH = "/";
process.env.__ONBOARDING_URL__ = "https://localhost:9005/";
process.env.__ACCOUNT_COOKIE_URL__ = "https://snickerdoodlelabs.io/";
process.env.__CONTROL_CHAIN_ID__ = "31337";
process.env.__SUPPORTED_CHAINS__ = "42,43113";
process.env.__IPFS_FETCH_BASE_URL__ = "http://localhost:8080/ipfs";
process.env.__DEFAULT_INSIGHT_PLATFORM_BASE_URL__ = "http://localhost:3006";
process.env.__COVALENT_API_KEY__ = "";
process.env.__MORALIS_API_KEY__ = "";
process.env.__DNS_SERVER_ADDRESS__ = "http://localhost:3006/dns";
process.env.__REQUEST_FOR_DATA_EVENT_FREQ__ = "4000";
process.env.__DOMAIN_FILTER__ = "(localhost|chrome:\/\/)";


var WebpackDevServer = require("webpack-dev-server"),
  webpack = require("webpack"),
  config = require("../webpack.config.cjs"),
  env = require("./env.cjs"),
  path = require("path");

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || [],
);

var compiler = webpack(config);

var server = new WebpackDevServer(
  {
    https: false,
    hot: false,
    client: false,
    host: "localhost",
    port: env.PORT,
    webSocketServer: false,

    static: {
      directory: path.join(__dirname, "../build"),
    },
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}/`,
      writeToDisk: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    allowedHosts: "all",
  },
  compiler,
);

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept();
}

(async () => {
  await server.start();
})();
