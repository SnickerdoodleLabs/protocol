module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    "babel-plugin-transform-typescript-metadata",
    "babel-plugin-parameter-decorator",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    // [
    //   "module-resolver",
    //   {
    //     alias: {
    //       crypto: "react-native-quick-crypto",
    //       stream: "stream-browserify",
    //       buffer: "@craftzdog/react-native-buffer",
    //     },
    //   },
    // ],
  ],
};
