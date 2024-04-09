# Contract Unit Tests

Unit tests are based on [Hardhat's version](https://hardhat.org/hardhat-runner/docs/guides/test-contracts) of the [Chai](https://www.chaijs.com/) assertion library. Each contract has its own testing script. 

Run all tests:

```shell
npx hardhat test
```

or from the `contracts` directory run 

```shell
yarn test
```

Only run tests in a given file:

```shell
npx hardhat test test/consent.js
```