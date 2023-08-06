# SnickerDoodle Nodeify

description

## Installation

To deploy this project run

```bash
  npm -i sd-nodeify or yarn add sd-nodeify
```

```bash
 ./node_modules/.bin/sd-nodeify --hack --install
```

```bash
  cd ios && pod install
```

In your babel.config.js, add a module resolver

```bash
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
+   [
+     'module-resolver',
+     {
+       alias: {
+         'crypto': 'react-native-quick-crypto',
+         'stream': 'stream-browserify',
+         'buffer': '@craftzdog/react-native-buffer',
+         'argon':  'react-native-argon2',
+       },
+     },
+   ],
    ...
  ],
    '@babel/plugin-syntax-import-assertions',
    'babel-plugin-transform-typescript-metadata',
    'babel-plugin-parameter-decorator',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
};
```

In your metro.config.js, add resolver to module_exports

```bash
const extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  crypto: require.resolve('react-native-quick-crypto'),
  zlib: require.resolve('browserify-zlib'),
  argon2: require.resolve('react-native-argon2'),
   };
 // rest of your code
   module.exports = {
    ...
   resolver: {
   ...
    extraNodeModules: require('node-libs-react-native'),
   },
}
```

Add required imports to your index.ts

```bash
+ import './shim.js';
+ require('node-libs-react-native/globals.js');
+ import 'reflect-metadata';
+ import setGlobalVars from 'indexeddbshim/dist/indexeddbshim-noninvasive';
+ import SQLite from 'react-native-sqlite-2';
+ import { MobileStorageUtils } from 'sd-nodeify';

To activate indexeddb in your project

 setGlobalVars(global, {
   checkOrigin: false,
   win: SQLite,
 });
```

In index.ts or whenever you want you can call SnickerdoodleCore

```bash
import { SnickerdoodleCore } from '@snickerdoodlelabs/core';
...
new SnickerdoodleCore(
 coreConfig, // Config file for SnickerdoodleCore
 new MobileStorageUtils(),
 undefined,
 undefined,
);
```
