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

OperatorGatewayModule#OperatorGateway - 0x13eA41031215A2802B2aB3eB2A406dcE3408ebCf
SnickerdoodleFactoryModule#SnickerdoodleFactory - 0xff7b119994f220C1BE738BdE8847BBCC2510422e
SnickerdoodleWalletModule#SnickerdoodleWallet - 0x8253E2Fd0e08D9Cef66c759d3f13bc6FE401598C
OperatorGatewayModule#UpgradeableBeacon - 0xC928cA75230F4563b09A8E485844f92a5eD0E98C
SnickerdoodleFactoryModule#TransparentUpgradeableProxy - 0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615
SnickerdoodleWalletModule#UpgradeableBeacon - 0x28F939708D89Ab8D5a60EF65b0B543257DCCA9EB
SnickerdoodleFactoryModule#SnickerdoodleFactoryProxy - 0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615
SnickerdoodleFactoryModule#ProxyAdmin - 0x7538Cfbc23C01CfA26F740e407BF50a911d2F14b
   ```

    ```shell
    npx hardhat ignition deploy ignition/modules/SnickerdoodleFactory.ts --network basesepolia --strategy create2 --reset
    ```

   Expected output:
   ```shell
   Deployed Addresses
OperatorGatewayModule#OperatorGateway - 0x13eA41031215A2802B2aB3eB2A406dcE3408ebCf
SnickerdoodleFactoryModule#SnickerdoodleFactory - 0xff7b119994f220C1BE738BdE8847BBCC2510422e
SnickerdoodleWalletModule#SnickerdoodleWallet - 0x8253E2Fd0e08D9Cef66c759d3f13bc6FE401598C
OperatorGatewayModule#UpgradeableBeacon - 0xC928cA75230F4563b09A8E485844f92a5eD0E98C
SnickerdoodleFactoryModule#TransparentUpgradeableProxy - 0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615
SnickerdoodleWalletModule#UpgradeableBeacon - 0x28F939708D89Ab8D5a60EF65b0B543257DCCA9EB
SnickerdoodleFactoryModule#SnickerdoodleFactoryProxy - 0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615
SnickerdoodleFactoryModule#ProxyAdmin - 0x7538Cfbc23C01CfA26F740e407BF50a911d2F14b
   ```
   Because we deployed using the create2 strategy, it should produce the same contract addresses on both chains. 

   Sample SnickerdoodleFactory's Proxy address deployed on [Fuji](https://testnet.snowtrace.io/address/0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615) and [Base Sepolia](https://sepolia.basescan.org/address/0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615): `0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615`

1. Update the `SNICKERDOODLE_WALLET_FACTORY` in [SnickerdoodleWallet.ts](/tasks/SnickerdoodleWallet.ts#L3) with the SnickerdoodleFactoryModule#TransparentUpgradeableProxy's address deployed above for the Hardhat tasks to work correctly.

2. We then need to call `setPeer` to connect the contracts together. The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts). We need to do this step for all destination chain ids we want to connect.

   The respective peer contract addresses are the contract addresses deployed above.

    - Amoy's endpoint id is `40267`
    - Fuji's endpoint id is `40106`
    - Base Sepolia's endpoint id is `40245`

   Call `setPeer` on the Fuji contract to point to the Amoy contract:
   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615 --peercontract 0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615 --eid 40245 --network fuji
   ```
   Call `setPeer` on the Amoy contract to point to the Fuji contract:

   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615 --peercontract 0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615 --eid 40106 --network basesepolia
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

    ProviderError: execution reverted: SnickerdoodleFactory: Snickerdoodle Operator with selected domain name has not been created on the source chain
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
    hash: '0xabf6eb95957bc2f175ce3152ed06edb42af667008f0ada3e1055980a33a08ee4'
    ...
   ```
   Use the transaction hash to obtain the address that the OperatorGatewayProxy was deployed to. For example, the deployed contract address is [0xc5a9E370B974D6fC4ED9036602F87dF9869A6aba](https://testnet.snowtrace.io/tx/0xabf6eb95957bc2f175ce3152ed06edb42af667008f0ada3e1055980a33a08ee4?chainid=43113). Update the OPERATOR_GATEWAY_PROXY variable [here](./tasks/snickerdoodleFactory.ts#L7). Now some that hardhat tasks will act as an operator that owns the `snickerdoodle` domain.

4. We can also cross check the deployed address of the Operator Gateway Proxy using the command below:
    ``` shell
    npx hardhat computeOperatorGatewayProxyAddress --domain snickerdoodle --network fuji
    ```
    Expected output:

    ``` shell
    Operator gateway proxy address: 0xc5a9E370B974D6fC4ED9036602F87dF9869A6aba
    ```
5. We can confirm that it has been deployed on the source chain using the command below: 
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xc5a9E370B974D6fC4ED9036602F87dF9869A6aba --network fuji
    ```
    Expected output 
    ```shell
    Operator gateway params:
    - Domain: snickerdoodle
    - Operator Accounts: No operator accounts
    ```
    We can also confirm that there is no param set on the destination chain.
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xc5a9E370B974D6fC4ED9036602F87dF9869A6aba --network basesepolia
    ```
    Expected output 
    ```shell
    Operator gateway params:
    - Domain: No domain
    - Operator Accounts: No operator accounts
    ```
6.  Now we can reserve the operator domain on the destination chain. To do that, we first get a quote of the fees to send that message from our source chain.
    ``` shell
    npx hardhat quoteReserveOperatorGatewayOnDestinationChain --destinationchainid 40245 --domain snickerdoodle --gas 90000 --network fuji
    ```
    Expected output:

    ``` shell
    Quoted price: Result(2) [ 7381794193816442n, 0n ]
    ```
7.  Now we try to send a message to the destination chain to reserve it. Include the quoted price above into the `feeinwei` argument 

    ``` shell
    npx hardhat reserveOperatorGatewayOnDestinationChain --destinationchaineid 40245 --domain snickerdoodle --gas 90000 --feeinwei 7381794193816442 --network fuji
    ```
    Expected output: 
    ```shell
    Operator domain reserve request submitted to destination chain! Txhash: ContractTransactionReceipt ...
    hash: '0x5428ce910f54734c4d1282dda950c0cc80ccc156e2fb0c1e37525bfb4f9c201b',
    ...
    ```
8.  Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Base Sepolia) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0x5428ce910f54734c4d1282dda950c0cc80ccc156e2fb0c1e37525bfb4f9c201b). This process took about 2 minutes to reach the complete status.    
9.  Now we can confirm that the message was sent by checking the operator details again. 
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xc5a9E370B974D6fC4ED9036602F87dF9869A6aba --network basesepolia
    ```
    Expected output 
    ```shell
    Operator gateway params:
    - Domain: snickerdoodle
    - Operator Accounts: No operator accounts
    ```
10. Now we can deploy the Operator Gateway on the destination chain.

    ```shell
    npx hardhat deployOperatorGatewayProxy --domain snickerdoodle --network basesepolia
    ```
    Expected output
    ```shell
    Snickerdoodle Operator deployed!
    Transaction receipt: ContractTransactionReceipt...

  hash: '0xc303d9e19200ad06eae8ed0a5b29becf0e03bdc59f46de18215ea7956c028e79',
  ```
12. Next is to work with the wallets. We can get the wallet params this way.

    Compute the Snickerdoodle wallet proxy address for a given username, say `MYSnickerdoodleWALLET.snickerdoodle`.
    ``` shell
    npx hardhat computeWalletProxyAddress --usernamewithdomain MYSnickerdoodleWALLET.snickerdoodle --network fuji
    ```
    Expected output:

    ``` shell
    Wallet proxy address: 0xbc763bd29109778C0c7C41647C7050F1d50cafeA
    ```
    Check the wallet params on the contracts for both `basesepolia` and `fuji`: 
    ```shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xbc763bd29109778C0c7C41647C7050F1d50cafeA --network basesepolia
    ```
    Expected output 
    ```shell
    Wallet params:
     - Operator: 0x0000000000000000000000000000000000000000
     - Name: 
     - P256 details:
       - X: 0x0000000000000000000000000000000000000000000000000000000000000000
       - Y: 0x0000000000000000000000000000000000000000000000000000000000000000
       - Key Id: 
    EVM Accounts: No EVM accounts
    ```   
13. Now that our operators are setup, we can try deploying a Snickerdoodle wallet on the destination chain. We expect to see an error that says it has not deployed the wallet on the source chain.
    ``` shell
    npx hardhat deploySnickerdoodleWalletProxyViaOperatorGateway --username MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network basesepolia
    ```
   Expected output:

    ``` shell
    ...ProviderError: execution reverted: SnickerdoodleWalletFactory: Snickerdoodle wallet with selected name has not been created on the source chain
    ```

13. Deploy a Snickerdoodle wallet on the source chain. 
    ``` shell
    npx hardhat deploySnickerdoodleWalletProxyViaOperatorGateway --username MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network fuji
    ```
    Expected output:

    ``` shell
    Snickerdoodle wallet deployed!
    Transaction receipt...
    hash: '0xcdefe9a29be0393629fa2aba3c79f03323e5c956ce6c087f2dcd47d9cbdbd442',
    ...
    ```
14. To get the wallet and operator gateway beacon addresses: 
     ``` shell
    npx hardhat getWalletAndOperatorGatewayBeaconAddresses --network fuji
    ```
    Expected output:

    ``` shell
    Wallet beacon address: 0xcD1622A338a4a6f3ea74c6EDBD49AE4b8c62Bd39
    Operator gateway beacon address: 0xA79bd48823603Ba2C1D99523bf2b6a680c50dbeA
    ```
15. We can confirm that the operator, and x and y point matches the deployed and computed proxy address.

    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xbc763bd29109778C0c7C41647C7050F1d50cafeA --network fuji
    ```
    Expected output:

    ``` shell
    Wallet params:
    - Operator: 0xc5a9E370B974D6fC4ED9036602F87dF9869A6aba
    - Name: MYSnickerdoodleWALLET.snickerdoodle
    - P256 details:
    - X: 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5
    - Y: 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f
    - Key Id: TAp_FZMZshG7RuJhiObFTQ
    EVM Accounts: No EVM accounts
    ```

    Confirm that owner does not exist yet on the destination chain.
    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xbc763bd29109778C0c7C41647C7050F1d50cafeA --network basesepolia
    ```
    Expected output:

    ``` shell
    Wallet params:
     - Operator: 0x0000000000000000000000000000000000000000
     - Name: 
     - P256 details:
       - X: 0x0000000000000000000000000000000000000000000000000000000000000000
       - Y: 0x0000000000000000000000000000000000000000000000000000000000000000
       - Key Id: 
    EVM Accounts: No EVM accounts
    ``` 

16. Before claiming the wallet on the destination chain, we get a quote of the fees to send that message from our source chain.
    ``` shell
    npx hardhat quoteReserveWalletOnDestinationChain --destinationchainid 40245 --namewithdomain MYSnickerdoodleWALLET.snickerdoodle --operator 0xc5a9E370B974D6fC4ED9036602F87dF9869A6aba --gas 80000 --network fuji
    ```
    Expected output:

    ``` shell
    Quoted price: Result(2) [ 7364071575323038n, 0n ]
    ```

17. Now, we initiate a layer zero call from the source to the destination chain to claim the wallet on the destination chain. Using the quote above as the fee in wei. If the transaction is successful, Layer Zero will also send a message to the destination chain to update the owner of the Snickerdoodle wallet address.
    
    //TODO: test calling this with wrong Operators. 

    Finally try again with the correct params...
    ``` shell
    npx hardhat reserveWalletAddressOnDestinationChainViaOperatorGateway --destinationchaineid 40245 --username MYSnickerdoodleWALLET --gas 80000 --feeinwei 7364071575323038 --network fuji
    ```
    Expected output:

    ``` shell
    Wallet reserve request submitted to destination chain! Txhash: 0x1542267728fe709f242d88ec72697c7c1688dc4bc786bd5267f35bec70678733
    ```

17. Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Mumbai) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0x1542267728fe709f242d88ec72697c7c1688dc4bc786bd5267f35bec70678733). This process took about 2 minutes to reach the complete status.
18. Repeat the Snickerdoodle wallet ownership check on the source and destination chains to confirm that Layer Zero has updated the destination chain's status.

    ``` shell
    npx hardhat getOwnerOfSnickerdoodleWallet --snickerdoodlewalletaddress 0x50E8ECf5b062632E539289208746aba5167191F0 --network fuji
    ```

    Expected output: 
    
    ``` shell
    Operator: 0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7
    Passkey point X: 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5
    Passkey point Y: 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f
    Passkey Id: TAp_FZMZshG7RuJhiObFTQ
    ```
    
    Running this command gets the owner of the Snickerdoodle wallet address on the Base Sepolia contract.
    ``` shell
    npx hardhat getOwnerOfSnickerdoodleWallet --snickerdoodlewalletaddress 0x50E8ECf5b062632E539289208746aba5167191F0 --network basesepolia
    ```
    Expected output: 
    
    ``` shell
    Operator: 0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7
    Passkey point X: 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5
    Passkey point Y: 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f
    Passkey Id: TAp_FZMZshG7RuJhiObFTQ
    ```

19. Finally, we can now create a Snickerdoodle wallet on the destination chain.

    ``` shell
    npx hardhat deploySnickerdoodleWalletUpgradeableBeacon --name MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network basesepolia
    ```
    Expected output:
    ``` shell
    Snickerdoodle wallet deployed!
    Transaction receipt...
    ```
    

