# web-integration

This package provides unified access to the sdlDataWallet object, and from there, the Snickerdoodle Protocol and a user's data wallet. This package is intended for use by DApps- browser applications that have already managed connecting to the Web3 ecosystem via tools like Metamask or WalletConnect. It is intended to be used within the context of a bundler such as Webpack for the final deployment. It is a native ESM module and should be usable directly in a browser, although such usage is not tested.

Once integrated and started, this module provides the integrating DApp with an instace of ISdlDataWallet, which may be provided via the Snickerdoodle Extension and injected into the webpage, or if that is not available, via an iframe integration. The DApp does not need to care about it, both provide equivalent functionality from an SDK standpoint. A user using the iframe variation can only process queries whle they are on the integrating web page, as opposed to the the extension. The iframe also has considerably lower data gathering capabilities since it cannot track a user between web pages.

This package is only meant for use by people familiar with Web3 development who are actually building a DApp. Other packages and options are available for anybody building an app that is not already a DApp. This package is not opinionated on the use of Web3 providers, and can seemlessly fit into an existing Web3-based login and auth flow. It assumes an understanding of [Ethers.js](https://docs.ethers.org/v6/)- if you are not already using that on your website, you should use a different package. 

## Get started

### Installation

install via yarn
`yarn add @snickerdoodlelabs/web-integration @snickerdoodlelabs/objects`

install via npm
`npm install @snickerdoodlelabs/web-integration @snickerdoodlelabs/objects`

### How to integrate

You need to have access to an Ethers Signer object before you start, either from an injected Web3 provider from something like Metamask (window.ethereum) or creating it via tools like WalletConnect. If you have a DApp already, you should already have this established. Once you do, you just need to create a SnickerdoodleWebIntegration object and call initialize() on it. initialize() returns a ResultAsync, which you can follow up with the tools from Neverthrow, or you can await it to turn it back into a promise and retrieve the value.

```
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";

const integration = new SnickerdoodleWebIntegration(
    {
      primaryInfuraKey: "a8ae124ed6aa44bb97a7166cda30f1bc",
    },
    provider.signer, // This is an ethers.Signer object
  );
return integration.initialize().map((sdlDataWallet) => {
  // Do whatever you want here, with the sdlDataWallet
})
```

## ISdlDataWallet
This interface presents most of the methods from the Snickerdoodle Core, but designed to be used via a DApp. You must use this interface to interact with the protocol from the browser. Most DApps will not need to do much- they will want to connect the account the user is using with your DApp to the user's data wallet and opt the user in to a consent contract. There are many more advanced uses of ISdlDataWallet though- it can provide an SSO style login for your app, and you can query data directly (if you request the permissions to do so). This can enable "magic" prefilled forms, for instance, or do an automated and verifyable age check for age limited websites.
