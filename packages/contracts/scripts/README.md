# Hardhat Scripts

This directory is used for holding [scripts](https://hardhat.org/hardhat-runner/docs/advanced/scripts#standalone-scripts-using-hardhat-as-a-library) to run with the Hardhat framework.

## [deployment.js](/packages/contracts/scripts/deployment.js)

Steps to deploy the contracts locally:

1. Spin up a local hardhat node, this will run a local blockchain network on localhost.

```shell
npx hardhat node
```

2. On a separate terminal, run the deployment scripts

```shell
npx hardhat run scripts/deployment.js --network localhost
```

3. If the deployment was successful, you should see the following in logged (addresses will differ).

```shell
Deploying Consent implementation contract...
Consent implementation contract deployed to: 0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f

Deploying Consent Factory contract...
Consent Factory deployed to: 0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d

Deploying UpgradeableBeacon contract...
UpgradeableBeacon deployed to: 0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6

Setting beacons address on Consent Factory...
Beacon address on Consent Factory set to: 0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6

Deploying Doodle Token contract...
DoodleToken deployed to: 0x4C4a2f8c81640e47606d3fd77B353E87Ba015584

Deploying Timelock Controller contract...
SnickerdoodleTimeLock deployed to: 0x21dF544947ba3E8b3c32561399E88B52Dc8b2823

Deploying SnickerdoodleGovernor (DAO) contract...
SnickerdoodleGovernor deployed to: 0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2

Full deployment successful!
```

4. Hurray! To summarize with some details, you have successfully deployed:
   - the Consent implementation contract,
   - the Consent Factory contract,
   - the UpgradeableBeacon contract that the Beacon Proxies deployed by the Consent Factory contract points to upon creating a new 'Consent' instance, which in turn points to the Consent implementation contract deployed,
   - the Doodle Token contract,
   - the Timelock Controller contract that will help govern the proposal and execution processes on the SnickerdoodleGovernor contract,
   - the SnickerdoodleGovernor contract which serves as the DAO.

---