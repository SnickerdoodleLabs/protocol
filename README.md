![Snickerdoodle Protocol](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# The Snickerdoodle Protocol

The Snickerdoodle Protocol (the *Protocol*) is a decentralized platform for privacy-enhancing data analysis and customer incentivization, that fundamentally shifts how such things are done in favor of the actual user. The Protocol is open and extensible, allowing for uses beyond the original vision. The Protocol defines a Data Wallet (DW), that is controlled by the user, into which their personal data is collected and curated, entirely at their discretion. Consumers of the protocol can use [Snickerdoodle Query Language](/documentation/sdql/README.md) (SDQL) to request an *Insight* from the network of user DWs in exchange for some form of reward. The [Snickerdoodle Core](/packages/core/README.md) package, which implements the bulk of the off-chain logic of the DW software, will process the SDQL request and return the Insight at the consent of the user, making it a form of distributed computing.

## High Level Architecture

![Protocol Architecture](/documentation/images/protocol-diagram.png)

The Snickerdoodle Protocol consists of *on-chain* and *off-chain* components. The on-chain component of the protocol consists of a series of [Solidity](https://soliditylang.org/) contracts contained in the [contracts package](/packages/contracts/README.md). The main functions of the on-chain protocol are governance, auditable consent tracking, and querying the DW network for insights. The off-chain part of the protocol is primarily characterized by the [Snickerdoodle Core](/packages/core/README.md), which is a typescript package that can be leveraged as the kernel for implementing a data wallet application in a variety of different form factors (i.e. a [browser extension](/packages/browserExtension/README.md), a mobile application, [headless runtime](/packages/test-harness/README.md), etc.). 

![Data Wallet Logic Layers](/documentation/images/cookievault-diagram.png)

The visualization of insights returned from the DW network requires that a consumer implement an insight aggregation service. Snickerdoodle Labs provides a turn-key SaaS platform for broadcasting, aggregating, and visualizing insights returned from the DW network. However, as the protocol is open and extensible, consumers may implement their own insight aggregation service. 

## Getting Started
 
If you would like to contribute to the Protocol, see [Getting Started](/documentation/GETTINGSTARTED.md). 

# End to End Testing
You can use this repository in conjuction with the Insight Platform repository to do an end to end test. You will need to create a "local" build of the extension, and dockerize the extension-onboarding package, to generate a docker image "snickerdoodlelabs/extension-onboarding:local". One version of this is available in NPM, but it may not be up to date.

## Step 1
Create the local build of the browser extension

`cd packages/browserExtension`
`yarn build-local`

## Step 2
Create an up to date version of the SPA
`cd ../extension-onboarding`
`yarn dockerize`

# Publishing
This repository is a monorepo, and the individual packages can not be developed except in the overall context of the monorepo itself. Thus, no individual package contains any dev dependencies. Each package has it's own runtime dependencies, listed in the package itself. Packages from the monorepo are published as individual packages, and once published, are free from any linkage to the monorepo origins.

To publish a package, first, make sure that its version is updated in the packages' package.json. We follow semantic versioning, major.minor.patch. The best thing to do is to use the built-in Yarn [version](https://yarnpkg.com/cli/version) commands  in deferred mode, while you are developing. If you just add a new primitive to Objects, that's just a patch upgrade. You can use: 
`cd packages/common-utils`
`yarn version --deferred patch`

Deferred versions are checked into Yarn and stored in .yarn/versions/4bce8eccc.yml (although it's possible this can change). One problem is that deferred versions seem to overwrite each other, so if I've committed a deferred major upgrade, if you do a patch upgrade it will take precedence. That's an issue with the yarn design for sure.

Once you are ready to publish the actual packags, run these commands at the root:
`yarn version apply` to apply any deferred versions.
`yarn workspace @snickerdoodlelabs/common-utils npm publish` Enter the proper name of the package to publish it.
Using this command at the root will transform the workspace:^ dependencies to the proper versions before publishing the package.
