![Snickerdoodle Protocol](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# The Snickerdoodle Protocol

The Snickerdoodle Protocol (the Protocol) is a decentralized platform for privacy-enhancing data analysis and customer incentivization, that fundamentally shifts how such things are done in favor of the actual user. The Protocol is open and extensible, allowing for uses beyond the original vision. The Protocol defines a Data Wallet (DW), that is controlled by the user, into which their personal data is collected and curated, entirely at their discretion. Consumers of the protocol can use [Snickerdoodle Query Language](/documentation/sdql/) (SDQL) to request an *Insight* from the network of user DWs in exchange for some form of reward. The [Snickerdoodle Core](/packages/core/) package, which implements the bulk of the off-chain logic of the DW software, will process the SDQL request and return the Insight at the consent of the user, making it a form of distributed computing.

## High Level Architecture

![Architecture Diagram](/documentation/images/protocol-architecture.png)

The Snickerdoodle Protocol consists of *on-chain* and *off-chain* components. The on-chain component of the protocol consists of a series of [Solidity](https://soliditylang.org/) contracts contained in the [contracts package](/packages/contracts/). The main functions of the on-chain protocol are governance, auditable consent tracking, and querying the DW network for insights. The off-chain part of the protocol is primarily characterized by the [Snickerdoodle Core](/packages/core/), which is a typescript package that can be leveraged as the kernel for implementing a data wallet application in a variety of different form factors (i.e. a [browser extension](/packages/browserExtension/), a mobile application, [headless runtime](/packages/test-harness/), etc.). 

The visualization of insights returned from the DW network requires that a consumer implement an insight aggregation service. Snickerdoodle Labs provides a turn-key SaaS platform for broadcasting, aggregating, and visualizing insights returned from the DW network. However, as the protocol is open and extensible, consumers may implement their own insight aggregation service. 