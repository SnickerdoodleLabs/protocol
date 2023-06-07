module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    "babel-plugin-transform-typescript-metadata",
    "babel-plugin-parameter-decorator",
    "@babel/plugin-syntax-import-assertions",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
  ],
};
