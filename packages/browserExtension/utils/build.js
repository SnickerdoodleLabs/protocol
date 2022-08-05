// These values are appropriate for Develop environment
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.env.ASSET_PATH = "/";
process.env.__ONBOARDING_URL__ = "https://extension.dev.snickerdoodle.dev/";
process.env.__ACCOUNT_COOKIE_URL__ = "https://snickerdoodlelabs.io/";
process.env.__CONTROL_CHAIN_ID__ = 31337;
process.env.__SUPPORTED_CHAINS__ = "42,43113";
process.env.__IPFS_FETCH_BASE_URL__ = "https://ipfs.snickerdoodle.dev/ipfs";
process.env.__DEFAULT_INSIGHT_PLATFORM_BASE_URL__ =
  "https://insight-api.dev.snickerdoodle.dev";
process.env.__COVALENT_API_KEY__ = "";
process.env.__MORALIS_API_KEY__ = "";
process.env.__DNS_SERVER_ADDRESS__ = "";

var webpack = require("webpack"),
  config = require("../webpack.config");

config.mode = "production";

webpack(config, function (err) {
  if (err) throw err;
});
