![Indexers](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Snickerdoodle Protocol Indexers Package

## Package Contents

- [src](/packages/indexers/src/): Subdirectory containing source files for the indexers package
- [test](/packages/indexers/test/): Subdirectory containing test files for the indexers package.

## Summary

The indexers package exists as an abstraction on top of various indexing providers, blockchains, and node data sources. In essence it serves as a general interface for polling transactions (and possibly other blockchain data) for use by the data wallet core. Polling logic for the data wallet can be found in the core at [MonitoringService.ts](/packages/core/src/implementations/business/MonitoringService.ts).

### Install Dependencies

Steps to install and run this project this locally:

```shell
yarn install
```

### Compiling 

Use yarn to compile the project like this:

```shell
yarn compile
```

This command should always be run before committing changes. 

### Testing

To run unit tests run:
```shell
yarn test
```

Unit testing files are located in [test](/packages/indexers/test/). See [test/README](/packages/indexers/test/README.md) for details.