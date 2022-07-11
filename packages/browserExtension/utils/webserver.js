// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
process.env.ASSET_PATH = "/";

var WebpackDevServer = require("webpack-dev-server"),
  webpack = require("webpack"),
  config = require("../webpack.config"),
  env = require("./env"),
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
