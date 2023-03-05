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
          '@': './src',
          types: './@types',
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'babel-plugin-transform-typescript-metadata',
    'babel-plugin-parameter-decorator',
    'inline-dotenv',
    'react-native-reanimated/plugin', // needs to be last
  ],
};
