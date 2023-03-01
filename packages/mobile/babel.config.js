/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.json'],
        alias: {
          '@snickerdoodlelabs/mobile': './src',
          types: './@types',
        },
      },
    ],
    'inline-dotenv',
    'react-native-reanimated/plugin', // needs to be last,
    'babel-plugin-transform-typescript-metadata',
    'babel-plugin-parameter-decorator',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
