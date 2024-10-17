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

    OperatorGatewayModule#OperatorGateway - 0x2b4260a693B19338a8F071207885b4F003df8CC2
    SnickerdoodleFactoryModule#SnickerdoodleFactory - 0x8061C28E8142903AD34C530698325d6f8fE6ec11
    SnickerdoodleWalletModule#SnickerdoodleWallet - 0xBE0cEef9439E288b11bD8A7765bc3A08995589e1
    OperatorGatewayModule#UpgradeableBeacon - 0xA5EaAE74b1baA4798A73DF0b8c3a2875a7117802
    SnickerdoodleFactoryModule#TransparentUpgradeableProxy - 0x233599DE659972dBD432cB3FC001E6185b4f10dC
    SnickerdoodleWalletModule#UpgradeableBeacon - 0x1D3E3E161b5911CF6aE0ee37bD71d1DC59C57e60
    SnickerdoodleFactoryModule#SnickerdoodleFactoryProxy - 0x233599DE659972dBD432cB3FC001E6185b4f10dC
    SnickerdoodleFactoryModule#ProxyAdmin - 0xa0A717E19Dfc76c71A30A2a230958cc8A1110224
   ```

    ```shell
    npx hardhat ignition deploy ignition/modules/SnickerdoodleFactory.ts --network basesepolia --strategy create2 --reset
    ```

   Expected output:
   ```shell
   Deployed Addresses

    OperatorGatewayModule#OperatorGateway - 0x2b4260a693B19338a8F071207885b4F003df8CC2
    SnickerdoodleFactoryModule#SnickerdoodleFactory - 0x8061C28E8142903AD34C530698325d6f8fE6ec11
    SnickerdoodleWalletModule#SnickerdoodleWallet - 0xBE0cEef9439E288b11bD8A7765bc3A08995589e1
    OperatorGatewayModule#UpgradeableBeacon - 0xA5EaAE74b1baA4798A73DF0b8c3a2875a7117802
    SnickerdoodleFactoryModule#TransparentUpgradeableProxy - 0x233599DE659972dBD432cB3FC001E6185b4f10dC
    SnickerdoodleWalletModule#UpgradeableBeacon - 0x1D3E3E161b5911CF6aE0ee37bD71d1DC59C57e60
    SnickerdoodleFactoryModule#SnickerdoodleFactoryProxy - 0x233599DE659972dBD432cB3FC001E6185b4f10dC
    SnickerdoodleFactoryModule#ProxyAdmin - 0xa0A717E19Dfc76c71A30A2a230958cc8A1110224
   ```
   Because we deployed using the create2 strategy, it should produce the same contract addresses on both chains. 

   Sample SnickerdoodleFactory's Proxy address deployed on [Fuji](https://testnet.snowtrace.io/address/0x233599DE659972dBD432cB3FC001E6185b4f10dC) and [Base Sepolia](https://sepolia.basescan.org/address/0x233599DE659972dBD432cB3FC001E6185b4f10dC): `0x233599DE659972dBD432cB3FC001E6185b4f10dC`

1. Update the `SNICKERDOODLE_WALLET_FACTORY` in [SnickerdoodleWallet.ts](/tasks/SnickerdoodleWallet.ts#L3) with the SnickerdoodleFactoryModule#TransparentUpgradeableProxy's address deployed above for the Hardhat tasks to work correctly.

2. We then need to call `setPeer` to connect the contracts together. The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts). We need to do this step for all destination chain ids we want to connect.

   The respective peer contract addresses are the contract addresses deployed above.

    - Amoy's endpoint id is `40267`
    - Fuji's endpoint id is `40106`
    - Base Sepolia's endpoint id is `40245`

   Call `setPeer` on the Fuji contract to point to the Amoy contract:
   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0x233599DE659972dBD432cB3FC001E6185b4f10dC --peercontract 0x233599DE659972dBD432cB3FC001E6185b4f10dC --eid 40245 --network fuji
   ```
   Call `setPeer` on the Amoy contract to point to the Fuji contract:

   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0x233599DE659972dBD432cB3FC001E6185b4f10dC --peercontract 0x233599DE659972dBD432cB3FC001E6185b4f10dC --eid 40106 --network basesepolia
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
    hash: '0x5097828ee4f8a2fec6f837ca4b5dbb79f2dc8376ba9ba73a6512db87896d94f2'
    ...
   ```
   Use the transaction hash to obtain the address that the OperatorGatewayProxy was deployed to. For example, the deployed contract address is [0xd746d066Dc666A54776a4aF965fc967954bEFc1a](https://testnet.snowtrace.io/tx/0x5097828ee4f8a2fec6f837ca4b5dbb79f2dc8376ba9ba73a6512db87896d94f2?chainid=43113). Update the OPERATOR_GATEWAY_PROXY variable [here](./tasks/snickerdoodleFactory.ts#L7). Now some that hardhat tasks will act as an operator that owns the `snickerdoodle` domain.

4. We can also cross check the deployed address of the Operator Gateway Proxy using the command below:
    ``` shell
    npx hardhat computeOperatorGatewayProxyAddress --domain snickerdoodle --network fuji
    ```
    Expected output:

    ``` shell
    Operator gateway proxy address: 0xd746d066Dc666A54776a4aF965fc967954bEFc1a
    ```
5. We can confirm that it has been deployed on the source chain using the command below: 
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xd746d066Dc666A54776a4aF965fc967954bEFc1a --network fuji
    ```
    Expected output 
    ```shell
    Operator gateway params:
    - Domain: snickerdoodle
    - Operator Accounts: No operator accounts
    ```
    We can also confirm that there is no param set on the destination chain.
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xd746d066Dc666A54776a4aF965fc967954bEFc1a --network basesepolia
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
    Quoted price: Result(2) [ 13194127950410386n, 0n ]
    ```
7.  Now we try to send a message to the destination chain to reserve it. Include the quoted price above into the `feeinwei` argument 

    ``` shell
    npx hardhat reserveOperatorGatewayOnDestinationChain --destinationchaineid 40245 --domain snickerdoodle --gas 90000 --feeinwei 14637980254081671 --network fuji
    ```
    Expected output: 
    ```shell
    Operator domain reserve request submitted to destination chain! Txhash: ContractTransactionReceipt ...
    hash: '0xca7d198d1c47e93c19a0eec1bb92fcb5af5ef92fe16c76afd6b553f040ae8b04',
    ...
    ```
8.  Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Base Sepolia) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0xca7d198d1c47e93c19a0eec1bb92fcb5af5ef92fe16c76afd6b553f040ae8b04). This process took about 2 minutes to reach the complete status.    
9.  Now we can confirm that the message was sent by checking the operator details again. 
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0xd746d066Dc666A54776a4aF965fc967954bEFc1a --network basesepolia
    ```
    Expected output 
    ```shell
    Operator gateway params:
    - Domain: snickerdoodle
    - Operator Accounts: No operator accounts
    ```
10. We can also check the wallet params this way. 
    Compute the Snickerdoodle wallet proxy address for a given username, say `MYSnickerdoodleWALLET.snickerdoodle`.
    ``` shell
    npx hardhat computeWalletProxyAddress --usernamewithdomain MYSnickerdoodleWALLET.snickerdoodle --network fuji
    ```
    Expected output:

    ``` shell
    Wallet proxy address: 0xa6259B94B43eC6E0fD3272E0b288E713a5B9D816
    ```
    Check the wallet params on the contracts for both `basesepolia` and `fuji`: 
    ```shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xa6259B94B43eC6E0fD3272E0b288E713a5B9D816 --network basesepolia
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
11. Now we can deploy the Operator Gateway on the destination chain.

    ```shell
    npx hardhat deployOperatorGatewayProxy --domain snickerdoodle --network basesepolia
    ```
    Expected output
    ```shell
    Snickerdoodle Operator deployed!
    Transaction receipt: ContractTransactionReceipt...

  hash: '0xb0a8d90f6bb5e296240b822a6b1375b434712f16b0f4db5abb032262db6cd947',
    ```
12. Now that our operators are setup, we can try deploying a Snickerdoodle wallet on the destination chain. We expect to see an error that says it has not deployed the wallet on the source chain.
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
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xa6259B94B43eC6E0fD3272E0b288E713a5B9D816 --network fuji
    ```
    Expected output:

    ``` shell
    Wallet params:
     - Operator: 0xd746d066Dc666A54776a4aF965fc967954bEFc1a
     - Name: MYSnickerdoodleWALLET.snickerdoodle
     - P256 details:
       - X: 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5
       - Y: 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f
       - Key Id: TAp_FZMZshG7RuJhiObFTQ
    EVM Accounts: No EVM accounts
    ```

    Confirm that owner does not exist yet on the destination chain.
    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xa6259B
94B43eC6E0fD3272E0b288E713a5B9D816 --network basesepolia
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
    npx hardhat quoteReserveWalletOnDestinationChain --destinationchainid 40245 --namewithdomain MYSnickerdoodleWallet.snickerdoodle --operator 0xd746d066Dc666A54776a4aF965fc967954bEFc1a --gas 80000 --network fuji
    ```
    Expected output:

    ``` shell
    Quoted price: Result(2) [ 13028437049149633, 0n ]
    ```

17. Now, we initiate a layer zero call from the source to the destination chain to claim the wallet on the destination chain. Using the quote above as the fee in wei. If the transaction is successful, Layer Zero will also send a message to the destination chain to update the owner of the Snickerdoodle wallet address.
    
    The claim function does a few checks before proceeding to send a message to the destination chain to claim a Snickerdoodle wallet. The claim function will fail if the user has deployed/has not deployed a wallet on the source chain or provided a wrong wallet name, x, y or passkey id value. The steps below tests each scenario. 

    User tries with a wallet name that has not been deployed against the owner address (change any value from the original).
    ``` shell
    npx hardhat claimSnickerdoodleWalletAddressOnDestinationChain --destinationchaineid 40245 --walletname WRONGSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --gas 120000 --feeinwei 19472638481936229 --network fuji
    ```
    Expected output:
    ``` shell
    ...ProviderError: execution reverted: SnickerdoodleWalletFactory: Operator of provided wallet name does not match caller
    ```

    User tries with a wrong X value (change any value from the original).
    ``` shell
    npx hardhat claimSnickerdoodleWalletAddressOnDestinationChain --destinationchaineid 40245 --walletname MYSnickerdoodleWALLET --qx 0x3e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --gas 120000 --feeinwei 19472638481936229 --network fuji
    ```
    Expected output:
    ``` shell
    ...ProviderError: execution reverted: SnickerdoodleWalletFactory: Point X of provided wallet name does not match of given _qx
    ```
    
    User tries with a wrong Y value (change any value from the original).
    ``` shell
    npx hardhat claimSnickerdoodleWalletAddressOnDestinationChain --destinationchaineid 40245 --walletname MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xA98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --gas 120000 --feeinwei 19472638481936229 --network fuji
    ```
    Expected output:
    ``` shell
    ...ProviderError: execution reverted: SnickerdoodleWalletFactory: Point Y of provided wallet name does not match operator _qy
    ```

    User tries with a wrong key id (change any value from the original).
    ``` shell
    npx hardhat claimSnickerdoodleWalletAddressOnDestinationChain --destinationchaineid 40245 --walletname MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid PAp_FZMZshG7RuJhiObFTQ --gas 120000 --feeinwei 19472638481936229 --network fuji
    ```
    Expected output:
    ``` shell
    ...ProviderError: execution reverted: SnickerdoodleWalletFactory: Key id of provided wallet name does not match _keyId
    ```

    Finally try again with the correct params...
    ``` shell
    npx hardhat reserveWalletAddressOnDestinationChainViaOperatorGateway --destinationchaineid 40245 --username MYSnickerdoodleWALLET --gas 80000 --feeinwei 13028437049149633 --network fuji
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
    

