process.env.__BUILD_ENV__ = "dev";

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
    https: false,
    static: {
      directory: path.join(__dirname, "./"),
    },
    historyApiFallback: true,
    liveReload: true,
    compress: false,
    port: 9020,
    devMiddleware: {
      writeToDisk: false,
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
