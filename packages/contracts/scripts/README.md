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
Consent deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Consent Gas Fee: 3320261

Deploying Consent Factory contract...
ConsentFactory deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ConsentFactory Gas Fee: 3296490

Deploying Doodle Token contract...
DoodleToken deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
DoodleToken Gas Fee: 1769284

Deploying Timelock Controller contract...
SnickerdoodleTimeLock deployed to: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
SnickerdoodleTimeLock Gas Fee: 2186574

Deploying SnickerdoodleGovernor (DAO) contract...
SnickerdoodleGovernor deployed to: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
SnickerdoodleGovernor Gas Fee: 3663079

Deploying Crumbs contract...
Crumbs deployed to: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
Crumbs Gas Fee: 2431053

Deploying Sift contract...
Sift deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Sift Gas Fee: 2473661

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
