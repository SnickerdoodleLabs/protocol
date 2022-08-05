![Core](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Snickerdoodle Core Package

## Package Contents

- [src](/packages/core/src/): source code for the core package of Snickerdoodle protocol 
- [test](/packages/core/test/): Jest-based test suite for the core package

## Summary

![Data Wallet Logic Layers](/documentation/images/datawallet-architecture.png)

The Core package can be thought of as the *entrypoint* of the Snickerdoodle Protocol. The Core package is responsible for 
linking crypto accounts to a user persona, generating a derived Snickerdoodle Data Wallet key, managing data persistence, 
listening for `requestForData` events, etc. The Core is written in Typescript and follows an [n-tier architecture](https://en.wikipedia.org/wiki/Multitier_architecture) design.
This package (as well as nearly every other package in this monorepo), relies heavily on [InversifyJS](https://inversify.io/) for dependency injection and 
[NeverThrow](https://github.com/supermacro/neverthrow) for better error handling. 

### Getting Started

The best way to get acquainted with the Core package is to use the [Test Harness](/packages/test-harness/README.md) which is a command-line tool that exposes the major
functionalities of the protocol to a developer in a self-contained process.