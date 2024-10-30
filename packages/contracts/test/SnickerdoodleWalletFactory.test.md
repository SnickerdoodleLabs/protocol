# Testing SnickerdoodleWalletFactory (with Hardhat Tasks)

## Introduction

Layer Zero's OApps (Omnichain Apps) enable messaging between contracts on different chains. By having the Snickerdoodle Wallet contracts inherits the OApp, it allows the Snickerdoodle Wallet contracts deployed on different chains to update each other's states via messages. Below is a diagram of how the Snickerdoodle Wallet contracts work.

![Alt text](../layerZeroSnickerdoodleWallet.png)

At the time of writing, it is not possible to perform local unit testing due to the following reasons.
- There is currently not support for testing LayerZero contracts with 2 different chains via Hardhat.
- LayerZero's mocks only differentiates the source and destination contracts via mock endpoint ids. The contracts themselves are all deployed on the same Hardhat chain.
- As the goal is to have the same Snickerdoodle wallet contract addresses deployed on various EVM chains using `create2`, it is not possible to replicate this implementation when testing on a single Hardhat chain. 

Hence, this README walks through an example of how the contracts can be tested on testnets.

## Testing steps
For this example, we will deploy SnickerdoodleWalletFactory and OperatorGateway contracts on the Fuji testnet to Amoy testnet. SnickerdoodleWalletFactory contracts inherit the OApp contract based on the Layer Zero's (LZ) V2 implementation [here](https://docs.layerzero.network/v2/developers/evm/oapp/overview).

Both contracts will be similar so that we would be able to send and receive messages between them (ie. they both have the same LZ sending and receiving implementations).

Start by cloning the repo and installing the dependencies.

```sh
git clone https://github.com/SnickerdoodleLabs/protocol.git
cd protocol
yarn 
cd packages/contracts
```
1. Make necessary `.env` updates with the private key of the signing account and fund the accounts with Fuji AVAX, Amoy MATIC or Base Sepolia ETH tokens.
2. Set the correct the LZ endpoint address and owner params before each contract deployments in the [SnickerdoodleFactory.ts](/ignition/modules/SnickerdoodleFactory.ts#L47) file. The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts).
3. Once the params are correctly set, deploy the SnickerdoodleFactory to Fuji and Base Sepolia testnets. If you redeploy twice to the same network and it fails, be sure to check or update the salt value in the Hardhat Config file [here](/hardhat.config.ts#L40) as it cannot be reused for create2 since it is deterministic! The ignition error is will look something like this: 
   
   ```shell
   Futures failed during execution:
 - OperatorGatewayModule#OperatorGateway: Simulating the transaction failed with error: Reverted with custom error FailedContractCreation("0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed")
 - SnickerdoodleFactoryModule#SnickerdoodleFactory: Simulating the transaction failed with error: Reverted with custom error FailedContractCreation("0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed")
 - SnickerdoodleWalletModule#SnickerdoodleWallet: Simulating the transaction failed with error: Reverted with custom error FailedContractCreation("0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed")
  ```

However, if you run into an nonce error during the deployment, wait for a minute (for transactions to mine) and just run re run the command below without the `--reset` flag. Basically ignition is trying to run another deployment/transaction written in the modules but a previous transaction has not completed yet. Running it without the `--reset` flag tells Hardhat Ignition to pick up from where it left off. 

   ```shell
   npx hardhat ignition deploy ignition/modules/SnickerdoodleFactory.ts --network fuji --strategy create2 --reset
   ```

   Expected output:
   ```shell
   Deployed Addresses

OperatorGatewayModule#OperatorGateway - 0x3b06570d60588d5d75b5A9E095E4C5DEDB64714c
SnickerdoodleFactoryModule#SnickerdoodleFactory - 0x16E68a0e3AB86d8416A7aEA44DAe83c27d658A2D
SnickerdoodleWalletModule#SnickerdoodleWallet - 0xE474C5ACD881b40278228e8b0B933ea5fe9EFCbf
OperatorGatewayModule#UpgradeableBeacon - 0xF932Ea93E8Adc7BCB3147968407622dE6A1153D7
SnickerdoodleFactoryModule#TransparentUpgradeableProxy - 0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5
SnickerdoodleWalletModule#UpgradeableBeacon - 0xa76877366B201530B45F06737400878680568909
SnickerdoodleFactoryModule#SnickerdoodleFactoryProxy - 0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5
SnickerdoodleFactoryModule#ProxyAdmin - 0x8C1e89ADD2BD008BDE67EA93eB4Bc91dc210D3c2
   ```

    ```shell
    npx hardhat ignition deploy ignition/modules/SnickerdoodleFactory.ts --network basesepolia --strategy create2 --reset
    ```

   Expected output:
   ```shell
   Deployed Addresses
OperatorGatewayModule#OperatorGateway - 0x3b06570d60588d5d75b5A9E095E4C5DEDB64714c
SnickerdoodleFactoryModule#SnickerdoodleFactory - 0x16E68a0e3AB86d8416A7aEA44DAe83c27d658A2D
SnickerdoodleWalletModule#SnickerdoodleWallet - 0xE474C5ACD881b40278228e8b0B933ea5fe9EFCbf
OperatorGatewayModule#UpgradeableBeacon - 0xF932Ea93E8Adc7BCB3147968407622dE6A1153D7
SnickerdoodleFactoryModule#TransparentUpgradeableProxy - 0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5
SnickerdoodleWalletModule#UpgradeableBeacon - 0xa76877366B201530B45F06737400878680568909
SnickerdoodleFactoryModule#SnickerdoodleFactoryProxy - 0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5
SnickerdoodleFactoryModule#ProxyAdmin - 0x8C1e89ADD2BD008BDE67EA93eB4Bc91dc210D3c2
   ```
   Because we deployed using the create2 strategy, it should produce the same contract addresses on both chains. 

   Sample SnickerdoodleFactory's Proxy address deployed on [Fuji](https://testnet.snowtrace.io/address/0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5) and [Base Sepolia](https://sepolia.basescan.org/address/0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5): `0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5`

1. Update the `SNICKERDOODLE_WALLET_FACTORY` in [snickerdoodleFactory.ts](/tasks/snickerdoodleFactory.ts#L3) with the SnickerdoodleFactoryModule#TransparentUpgradeableProxy's address deployed above for the Hardhat tasks to work correctly.

2. We then need to call `setPeer` to connect the contracts together. The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts). We need to do this step for all destination chain ids we want to connect.

   The respective peer contract addresses are the contract addresses deployed above.

    - Amoy's endpoint id is `40267`
    - Fuji's endpoint id is `40106`
    - Base Sepolia's endpoint id is `40245`

   Call `setPeer` on the Fuji contract to point to the Amoy contract:
   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5 --peercontract 0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5 --eid 40245 --network fuji
   ```
   Call `setPeer` on the Amoy contract to point to the Fuji contract:

   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5 --peercontract 0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5 --eid 40106 --network basesepolia
   ```
   Expected output from both
   ```shell
   Set peer successful!
   ```
3. Next we need to deploy an OperatorGatewayProxy on both chains. This mimics the step a business/organisation like Snickerdoodle participating in the protocol as an operator. All that is required is a domain name. There are 3 main steps: 
  - Deploy the Operator Gateway Proxy on the source chain
  - Reserve the domain on the destination via Layer Zero's messaging
  - Deploy it on the destination chain

   Try deploying on the destination chain first:
   ```shell
   npx hardhat deployOperatorGatewayProxy --domain snickerdoodle --network basesepolia
   ```
   Expected output
   ```shell
    Transaction failed: EntityNotClaimedOnSouceChain
   ```
   
   Deploy it on the source chain: 
   ```shell
   npx hardhat deployOperatorGatewayProxy --domain snickerdoodle --network fuji
   ```
   Expected output
   ```shell
   Snickerdoodle Operator deployed!
    Transaction receipt ContractTransactionReceipt
    ...
    hash: '0xccfc5527065db3883b8c91d9a790f4bf767b0fdff8309d2d3da43c4991d4a60e'
    ...
   ```
   Use the transaction hash to obtain the address that the OperatorGatewayProxy was deployed to. For example, the deployed contract address is [0xBD1C55527406E06A6028C0E3Da95232F8Fcd44f6](https://testnet.snowtrace.io/tx/0xccfc5527065db3883b8c91d9a790f4bf767b0fdff8309d2d3da43c4991d4a60e). Update the OPERATOR_GATEWAY_PROXY variable [here](./tasks/snickerdoodleFactory.ts#L7). Now some that hardhat tasks will act as an operator that owns the `snickerdoodle` domain.

4. We can also cross check the deployed address of the Operator Gateway Proxy using the command below:
    ``` shell
    npx hardhat computeOperatorGatewayProxyAddress --domain snickerdoodle --network fuji
    ```
    Expected output:

    ``` shell
    Operator gateway proxy address: 0xBD1C55527406E06A6028C0E3Da95232F8Fcd44f6
    ```
5. We can confirm that it has been deployed on the source chain using the command below: 
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xBD1C55527406E06A6028C0E3Da95232F8Fcd44f6 --network fuji
    ```
    Expected output 
    ```shell
   Operator gateway params:
- Domain: snickerdoodle
- Hash: 0xbb710bc68b3b466f09ba6ea1dc094eb93953bc92729d69d9ed99d03aad362f00
- Operators: [ '0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7' ]
    ```
    We can also confirm that there is no param set on the destination chain.
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xBD1C55527406E06A6028C0E3Da95232F8Fcd44f6 --network basesepolia
    ```
    Expected output 
    ```shell
    Operator gateway params:
   - Domain: No domain
   - Hash: 0x0000000000000000000000000000000000000000000000000000000000000000
   - Operators: No operators
    ```
6.  Now we can reserve the operator domain on the destination chain. To do that, we first get a quote of the fees to send that message from our source chain.
    ``` shell
    npx hardhat quoteAuthorizeOperatorGatewayOnDestinationChain --destinationchainid 40245 --domain snickerdoodle --gas 80000 --network fuji
    ```
    Expected output:

    ``` shell
    Quoted price: Result(2) [ 7991100054921046n, 0n ]
    ```
7.  Now we try to send a message to the destination chain to reserve it. Include the quoted price above into the `feeinwei` argument 

    ``` shell
    npx hardhat authorizeGatewayOnDestinationChain --destinationchaineid 40245 --domain snickerdoodle --gas 80000 --feeinwei 7991100054921046 --network fuji
    ```
    Expected output: 
    ```shell
    Operator domain reserve request submitted to destination chain! Txhash: ContractTransactionReceipt ...
    hash: '0x3d56aa579626f33688325538b75a158f00496dd684e1ea3284c98fd384afe1e3',
    ...
    ```
8.  Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Base Sepolia) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0x3d56aa579626f33688325538b75a158f00496dd684e1ea3284c98fd384afe1e3). This process took about 2 minutes to reach the complete status.    
9.  Now we can confirm that the message was sent by checking the operator details again. 
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xBD1C55527406E06A6028C0E3Da95232F8Fcd44f6 --network basesepolia
    ```

    Expected output as below. Note, we only store the hash on the destination chain message. The domain will only get set when the operator domain is deployed on the destination chain.
    ```shell
    Operator gateway params:
    - Domain: No domain
    - Hash: 0xbb710bc68b3b466f09ba6ea1dc094eb93953bc92729d69d9ed99d03aad362f00
    ```
10. Now we can deploy the Operator Gateway on the destination chain.

    ```shell
    npx hardhat deployOperatorGatewayProxy --domain snickerdoodle --network basesepolia
    ```
    Expected output
    ```shell
    Snickerdoodle Operator deployed!
    Transaction receipt: ContractTransactionReceipt...

  hash: '0xa2e66d6b700f6a9696dbc11468952d7079ff8ff85f926b4f74dd9354c80e8db5',
  ```
12. Next is to work with the wallets. We can get the wallet params this way.

    Compute the Snickerdoodle wallet proxy address for a given username, say `MYWALLET.snickerdoodle`.
    ``` shell
    npx hardhat computeWalletProxyAddress --usernamewithdomain MYWALLET.snickerdoodle --network fuji
    ```
    Expected output:

    ``` shell
    Wallet proxy address: 0x36E46d3D23D031f01F3dB4528Da01fd2e28c9089
    ```
13. Now that our operators are setup, we can try deploying a Snickerdoodle wallet on the destination chain. We expect to see an error that says it has not deployed the wallet on the source chain.
    ``` shell
    npx hardhat deployWalletsViaOperatorGateway --username MYWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network basesepolia
    ```
   Expected output:

    // TODO: figure out why error is undefined
    ``` shell
    Transaction failed: undefined
    ```      

13. Deploy a Snickerdoodle wallet on the source chain. 
    ``` shell
    npx hardhat deployWalletsViaOperatorGateway --username MYWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network fuji
    ```
    Expected output:

    ``` shell
    Snickerdoodle wallet deployed!
    Transaction receipt...
    hash: '0xa3d9f7a42ff4aec81281cebce5f4dcb057ba6951e331bdda8f7ada36655d1352',
    ...
    ```
14. To get the wallet and operator gateway beacon addresses: 
     ``` shell
    npx hardhat getWalletAndOperatorGatewayBeaconAddresses --network fuji
    ```
    Expected output:

    ``` shell
    Wallet beacon address: 0xa76877366B201530B45F06737400878680568909
Operator gateway beacon address: 0xF932Ea93E8Adc7BCB3147968407622dE6A1153D7
    ```
15. Update the `SNICKERDOODLE_WALLET_ADDRESS` in [snickerdoodleFactory.ts](/tasks/snickerdoodleFactory.ts#L9) with the deployed wallet address `0x36E46d3D23D031f01F3dB4528Da01fd2e28c9089`. We can then confirm that the wallet's details like this. 

    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0x36E46d3D23D031f01F3dB4528Da01fd2e28c9089 --network fuji
    ```
    Expected output:

    ``` shell
    Wallet params:
 - Name: MYWALLET.snickerdoodle
 - Hash: 0xf6936b35ad86a246086a1fe210590d75c209aa4ebf8c39b71f809dbe70cce382
 - Operator: 0xBD1C55527406E06A6028C0E3Da95232F8Fcd44f6
 - P256 keys: [
  Result(3) [
    '0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5',
    '0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f',
    'TAp_FZMZshG7RuJhiObFTQ'
  ]
]
 - EVM accounts: Result(0) ['0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7']
    ```

    Confirm that owner does not exist yet on the destination chain.
    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0x36E46d3D23D031f01F3dB4528Da01fd2e28c9089 --network basesepolia
    ```
    Expected output:

    ``` shell
    Wallet params:
    - Name: No name
    - Hash: 0x0000000000000000000000000000000000000000000000000000000000000000
    - Operator: No operator
    - P256 keys: []
    - EVM accounts: []
    ``` 

16. Before authorizing the wallet on the destination chain, we get a quote of the fees to send that message from our source chain.
    ``` shell
    npx hardhat quoteAuthorizeWalletOnDestinationChainViaOperatorGateway --destinationchainid 40245 --namewithdomain MYWALLET.snickerdoodle --gas 80000 --network fuji
    ```
    Expected output:

    ``` shell
    Quoted price: Result(2) [ 7994305399767811n, 0n ]
    ```

17. Now, we initiate a layer zero call from the source to the destination chain to claim the wallet on the destination chain. Using the quote above as the fee in wei. If the transaction is successful, Layer Zero will also send a message to the destination chain to update the owner of the Snickerdoodle wallet address.
    
    ``` shell
    npx hardhat authorizeWalletAddressOnDestinationChainViaOperatorGateway --destinationchaineid 40245 --username MYWALLET --gas 80000 --feeinwei 7994305399767811 --network fuji
    ```
    Expected output:

    ``` shell
    Wallet reserve request submitted to destination chain! Txhash: 0xbd29e6ec20fdcda5700e054dd3dd8b4c7dc785f0b7b958b0abb46f053682b16e
    ```

17. Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Mumbai) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0xbd29e6ec20fdcda5700e054dd3dd8b4c7dc785f0b7b958b0abb46f053682b16e). This process took about 2 minutes to reach the complete status.

18. Repeat the Snickerdoodle wallet ownership check on the source and destination chains to confirm that Layer Zero has updated the destination chain's status.

    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0x36E46d3D23D031f01F3dB4528Da01fd2e28c9089 --network basesepolia
    ```

    Expected output below. Note only the wallet hash is sent over from the source chain to the destination chain. The other params will be filled when the wallet is deployed on the destination chain.
    
    ``` shell
    Wallet params:
 - Name: No name
 - Hash: 0x732d6956a7778381e2ef8dc33787a6bd08f220e0dd3c72d450022d53a6460077
 - Operator: No operator
 - P256 keys: []
 - EVM accounts: []
    ```

19. Finally, we can now create a Snickerdoodle wallet on the destination chain.

    ``` shell
     npx hardhat deployWalletsViaOperatorGateway --username MYWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network basesepolia
    ```
    Expected output:
    ``` shell
    Snickerdoodle wallet deployed!
    Transaction receipt ContractTransactionReceipt
    ...
    hash: "0x32c62c3bc8168552e35adc16b6f9784a15586da6d30cb9e2ce48be3b21fc091b"
    ...
    ```
20. Repeat the Snickerdoodle wallet ownership check on the destination chains

    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0x36E46d3D23D031f01F3dB4528Da01fd2e28c9089 --network basesepolia
    ```

    Expected output below.
    ``` shell
    Wallet params:
 - Name: MYWALLET.snickerdoodle
 - Hash: 0x732d6956a7778381e2ef8dc33787a6bd08f220e0dd3c72d450022d53a6460077
 - Operator: undefined
 - P256 keys: [
  Result(3) [
    '0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5',
    '0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f',
    'TAp_FZMZshG7RuJhiObFTQ'
  ]
]
 - EVM accounts: Result(0) []
    ```

