/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');

const extraNodeModules = {
  '@snickerdoodlelabs/core': path.resolve(path.join(__dirname, '../core')),
  '@snickerdoodlelabs/utils': path.resolve(path.join(__dirname, '../utils')),
  '@snickerdoodlelabs/persistence': path.resolve(
    path.join(__dirname, '../persistence'),
  ),
  '@snickerdoodlelabs/objects': path.resolve(
    path.join(__dirname, '../objects'),
  ),
  '@snickerdoodlelabs/indexers': path.resolve(
    path.join(__dirname, '../indexers'),
  ),
  '@snickerdoodlelabs/insight-platform-api': path.resolve(
    path.join(__dirname, '../insight-platform-api'),
  ),
  '@snickerdoodlelabs/common-utils': path.resolve(
    path.join(__dirname, '../common-utils'),
  ),
  '@snickerdoodlelabs/contracts': path.resolve(
    path.join(__dirname, '../contracts'),
  ),
  '@snickerdoodlelabs/contracts-sdk': path.resolve(
    path.join(__dirname, '../contracts-sdk'),
  ),
  '@snickerdoodlelabs/query-parser': path.resolve(
    path.join(__dirname, '../query-parser'),
  ),
  '@snickerdoodlelabs/signature-verification': path.resolve(
    path.join(__dirname, '../signatureVerification'),
  ),
  stream: require.resolve('stream-browserify'),
  crypto: require.resolve('react-native-crypto'),
  argon2: require.resolve('react-native-argon2'),
};

const watchFolders = [
  path.resolve(path.join(__dirname, '../core')),
  path.resolve(path.join(__dirname, '../utils')),
  path.resolve(path.join(__dirname, '../persistence')),
  path.resolve(path.join(__dirname, '../objects')),
  path.resolve(path.join(__dirname, '../indexers')),
  path.resolve(path.join(__dirname, '../insight-platform-api')),
  path.resolve(path.join(__dirname, '../common-utils')),
  path.resolve(path.join(__dirname, '../contracts')),
  path.resolve(path.join(__dirname, '../contracts-sdk')),
  path.resolve(path.join(__dirname, '../query-parser')),
  path.resolve(path.join(__dirname, '../signatureVerification')),
  
];

const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))];
module.exports = {
  resolver: {
    extraNodeModules: require('node-libs-react-native'),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    project: {
      ios: {},
      android: {},
    },
    assets: ['./src/assets/'],
  },
  resolver: {
    extraNodeModules,
    nodeModulesPaths,
  },
  watchFolders,
};
