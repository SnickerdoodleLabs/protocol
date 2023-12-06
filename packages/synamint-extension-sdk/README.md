# @snickerdoodlelabs/synamint-extension-sdk

## Description

The `@snickerdoodlelabs/synamint-extension-sdk` serves as a powerful bridge for browser extensions, seamlessly connecting them to the expansive capabilities of Snickerdoodle Protocol. By integrating the SDK, your extensions can effortlessly harness the full suite of features found in the Snickerdoodle browser extension, offering users an enhanced and rewarding browsing experience.

🔒 **Privacy First: Keep Your Data Private**

Snickerdoodle prioritizes data privacy. Users can share data for rewards only with explicit consent. The SDK enables the collection of web2 data (browser activity and user demographics) and web3 data (blockchain activities). User data remains in their custody and is never accessed or shared without explicit consent. Explore our comprehensive data policy [here](https://policy.snickerdoodle.com/snickerdoodle-labs-data-privacy-policy).

🚀 **Unlock New Capabilies for Your Extension**

As a bridge to the Snickerdoodle Protocol, the SDK provides your extension with seamless access to every capability found in the Snickerdoodle browser extension like from anonymous data sharing to exclusive rewards through airdrops.

## Installation

To install the package, use [npm](https://www.npmjs.com/):

```bash
npm install @snickerdoodlelabs/synamint-extension-sdk

```

## Setup

Choose one of the following options to set up the Snickerdoodle extension SDK in your project:

### Automated Setup (Recommended)

1. Run the following command to automatically configure your extension using the provided script:

```bash
node node_modules/@snickerdoodlelabs/synamint-extension-sdk/shim.js
```

or you can add `node_modules/@snickerdoodlelabs/synamint-extension-sdk/shim.js` at the end of your build script in package.json

```json
{

  // ... package.json
  scripts: {
    <your build command>: <your existing build script> && node_modules/@snickerdoodlelabs/synamint-extension-sdk/shim.js
  }
}
```

Follow the on-screen instructions to complete the configuration process. The script will detect your manifest file, copy the required bundle, and update your manifest settings.

### Manual Setup

If you prefer manual setup or encounter issues with the automated script, follow these steps:

### 1. Locate Your Manifest File

If the automated script couldn't detect or configure your manifest file correctly, manually locate your manifest file (typically named `manifest.json`). This file is crucial for configuring your extension.

### 2. Copy the Bundle

Copy the bundled JavaScript file, \`dataWalletProxy.bundle.js\`, from the SDK into your extension's build directory. You can find this file in the `injectables` folder of the SDK.

```bash
cp node_modules/@snickerdoodlelabs/synamint-extension-sdk/injectables/dataWalletProxy.bundle.js <path/to/your/extension/build/>
```

Replace `<path/to/your/extension/build/>` with the actual path to your extension's build directory.

### 3. Update Your Manifest

Open your manifest file (`manifest.json`). Ensure it contains the necessary keys for permissions and web accessible resources.

```json
{
  "permissions": ["tabs", "storage", "activeTab"],
  "web_accessible_resources": [
    {
      "resources": ["dataWalletProxy.bundle.js"],
      "matches": ["<all_urls>"]
    }
    // Add other web accessible resources if needed
  ]
  // ... other manifest configurations
}
```

Make sure to add the required permissions and include the injected bundle as a web accessible resource.

## Usage

### In `background.ts`

```javascript
// background.ts

// Import the initializeSDKCore function and IExtensionSdkConfigOverrides from the SDK
import { initializeSDKCore } from "@snickerdoodlelabs/synamint-extension-sdk";
import { IExtensionSdkConfigOverrides } from "@snickerdoodlelabs/objects";

// Customize the SDK configuration
const sdkOptions: IExtensionSdkConfigOverrides = {
  // Your configuration options here
};

// Initialize the SDK with custom options
initializeSDKCore(sdkOptions);

// Your additional code here
```

### In `content.ts`

```javascript
// content.ts

// Import the initWebComponent function from the SDK
import { initWebComponent } from "@snickerdoodlelabs/synamint-extension-sdk/content";
import { IPaletteOverrides } from "@snickerdoodlelabs/objects";

// Customize the palette with overrides if needed
const paletteOverrides: IPaletteOverrides | undefined = {
  // Your palette override options here
};

// Initialize the web component
initWebComponent(paletteOverrides);

// Your additional code here
```

## Configuration

Customize the behavior of the Snickerdoodle extension SDK by providing configuration overrides. You can adjust various settings to tailor the SDK to your extension's requirements.

#### initializeSDKCore(config: IExtensionSdkConfigOverrides)

<details>
 <summary>IExtensionSdkConfigOverrides</summary>

| Configuration Option             | Type                   | Required | Description                                                |
| -------------------------------- | ---------------------- | -------- | ---------------------------------------------------------- |
| providerKey                      | string                 | yes      | The key associated with the extension provider.            |
| onboardingURL                    | URLString              | no       | The URL for onboarding your users to the extension.        |
| controlChainId                   | EChain                 | no       | The ID of the control chain.                               |
| ipfsFetchBaseUrl                 | URLString              | no       | The base URL for fetching data from IPFS.                  |
| defaultInsightPlatformBaseUrl    | URLString              | no       | The base URL for the default insight platform.             |
| accountIndexingPollingIntervalMS | number                 | no       | The polling interval in milliseconds for account indexing. |
| accountBalancePollingIntervalMS  | number                 | no       | The polling interval in milliseconds for account balance.  |
| accountNFTPollingIntervalMS      | number                 | no       | The polling interval in milliseconds for account NFTs.     |
| alchemyApiKeys                   |                        | no       | API keys for Alchemy on different chains.                  |
| etherscanApiKeys                 |                        | no       | API keys for Etherscan on different chains.                |
| covalentApiKey                   | string \| null         | no       | API key for Covalent.                                      |
| moralisApiKey                    | string \| null         | no       | API key for Moralis.                                       |
| nftScanApiKey                    | string \| null         | no       | API key for NFTScan.                                       |
| poapApiKey                       | string \| null         | no       | API key for POAP.                                          |
| oklinkApiKey                     | string \| null         | no       | API key for OKLink.                                        |
| ankrApiKey                       | string \| null         | no       | API key for Ankr.                                          |
| bluezApiKey                      | string \| null         | no       | API key for Bluez.                                         |
| raribleApiKey                    | string \| null         | no       | API key for Rarible.                                       |
| spaceAndTimeKey                  | string \| null         | no       | Key for space and time.                                    |
| blockvisionKey                   | string \| null         | no       | Key for Blockvision.                                       |
| dnsServerAddress                 | URLString              | no       | The address of the DNS server.                             |
| dataWalletBackupIntervalMS       | number                 | no       | The interval in milliseconds for data wallet backup.       |
| backupChunkSizeTarget            | number                 | no       | The target size for backup chunks.                         |
| requestForDataPollingIntervalMS  | number                 | no       | The polling interval in milliseconds for data requests.    |
| domainFilter                     | string                 | no       | The domain filter.                                         |
| defaultGoogleCloudBucket         | string                 | no       | The default Google Cloud bucket.                           |
| dropboxAppKey                    | string                 | no       | The Dropbox app key.                                       |
| dropboxAppSecret                 | string                 | no       | The Dropbox app secret.                                    |
| dropboxRedirectUri               | string                 | no       | The Dropbox redirect URI.                                  |
| discordOverrides                 | Partial<DiscordConfig> | no       | Overrides for Discord configuration.                       |
| heartbeatIntervalMS              | number \| null         | no       | The interval for heartbeat events in milliseconds.         |
| primaryInfuraKey                 | string \| null         | no       | The primary API key for Infura.                            |
| primaryRPCProviderURL            | ProviderUrl \| null    | no       | The primary RPC provider URL.                              |
| secondaryInfuraKey               | string \| null         | no       | The secondary API key for Infura.                          |
| secondaryRPCProviderURL          | ProviderUrl \| null    | no       | The secondary RPC provider URL.                            |
| queryPerformanceMetricsLimit     | number                 | no       | The limit for query performance metrics.                   |

</details>

#### initWebComponent(paletteOverrides?: IPaletteOverrides)

<details>
 <summary>IPaletteOverrides</summary>

| Palette Option  | Type   |
| --------------- | ------ |
| primary         | string |
| primaryContrast | string |
| button          | string |
| buttonContrast  | string |
| text            | string |
| linkText        | string |
| background      | string |
| border          | string |

</details>


## Troubleshooting

### ECMAScript Version Compatibility

If you encounter compatibility issues with JavaScript features or failing builds, ensure that your environment supports ECMAScript 2020 (ES11) or later.

```javascript
// Example vite.config.js
export default {
  // other Vite config options
  build: {
    target: 'es2020',
  },
};