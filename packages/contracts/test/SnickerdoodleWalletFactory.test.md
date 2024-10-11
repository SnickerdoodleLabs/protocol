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
For this example, we will deploy SnickerdoodleWalletFactory contracts on the Fuji testnet to Amoy testnet. SnickerdoodleWalletFactory contracts inherit the OApp contract based on the Layer Zero's (LZ) V2 implementation [here](https://docs.layerzero.network/v2/developers/evm/oapp/overview).

Both contracts will be similar so that we would be able to send and receive messages between them (ie. they both have the same LZ sending and receiving implementations).

Start by cloning the repo and installing the dependencies.

```sh
git clone https://github.com/SnickerdoodleLabs/protocol.git
cd protocol
yarn 
cd packages/contracts
```
1. Make necessary `.env` updates with the private key of the signing account and fund the accounts with Fuji AVAX, Amoy MATIC or Base Sepolia ETH tokens.
2. Set the correct the LZ endpoint address and owner params before each contract deployments in the [SnickerdoodleWalletFactory.ts](/ignition/modules/SnickerdoodleWalletFactory.ts#L6) file. The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts).
3. Once the params are correctly set, deploy the SnickerdoodleWalletFactory to Fuji and Amoy testnets:
   ```shell
   npx hardhat ignition deploy ignition/modules/SnickerdoodleWalletFactory.ts --network fuji --strategy create2 --reset
   ```

   Expected output:
   ```shell
   Deployed Addresses

   SnickerdoodleWalletModule#SnickerdoodleWalletFactory - 0x572B916bE8A2da113c9F5D34d28F805d9f9355B1
   ```

    ```shell
    npx hardhat ignition deploy ignition/modules/SnickerdoodleWalletFactory.ts --network basesepolia --strategy create2 --reset
    ```

   Expected output:
   ```shell
   Deployed Addresses

   SnickerdoodleWalletModule#SnickerdoodleWalletFactory - 0x572B916bE8A2da113c9F5D34d28F805d9f9355B1
   ```
   Because we deployed using the create2 strategy, it should produce the same contract addresses on both chains. 

   Sample SnickerdoodleWalletFactory addresses deployed on [Fuji](https://testnet.snowtrace.io/address/0x572B916bE8A2da113c9F5D34d28F805d9f9355B1) and [Amoy](https://amoy.polygonscan.com/address/0x572B916bE8A2da113c9F5D34d28F805d9f9355B1): `0x572B916bE8A2da113c9F5D34d28F805d9f9355B1`

4. Update the `SNICKERDOODLE_WALLET_FACTORY` in [SnickerdoodleWallet.ts](/tasks/SnickerdoodleWallet.ts#L3) with the newly deployed contract address for the Hardhat tasks to work correctly.

5. We then need to call `setPeer` to connect the contracts together. The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts). We need to do this step for all destination chain ids we want to connect.

   The respective peer contract addresses are the contract addresses deployed above.

    - Amoy's endpoint id is `40267`
    - Fuji's endpoint id is `40106`
    - Base Sepolia's endpoint id is `40245`

   Call `setPeer` on the Fuji contract to point to the Amoy contract:
   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0x572B916bE8A2da113c9F5D34d28F805d9f9355B1 --peercontract 0x572B916bE8A2da113c9F5D34d28F805d9f9355B1 --eid 40245 --network fuji
   ```
   Call `setPeer` on the Amoy contract to point to the Fuji contract:

   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0x572B916bE8A2da113c9F5D34d28F805d9f9355B1 --peercontract 0x572B916bE8A2da113c9F5D34d28F805d9f9355B1 --eid 40106 --network basesepolia
   ```
   
6. Try deploying a Snickerdoodle wallet on the destination chain. We expect to see an error that says it has not deployed the wallet on the source chain.
    ``` shell
    npx hardhat deploySnickerdoodleWalletUpgradeableBeacon --name MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network basesepolia
    ```
   Expected output:

    ``` shell
    ...ProviderError: execution reverted: SnickerdoodleWalletFactory: Snickerdoodle wallet with selected name has not been created on the source chain
    ```

7. Deploy a Snickerdoodle wallet on the source chain. 
    ``` shell
    npx hardhat deploySnickerdoodleWalletUpgradeableBeacon --name MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network fuji
    ```
    Expected output:

    ``` shell
    Snickerdoodle wallet deployed!
    Transaction receipt...
    ```

8. Compute the Snickerdoodle wallet proxy address for a given name.
    ``` shell
    npx hardhat computeSnickerdoodleWalletProxyAddress --name MYSnickerdoodleWALLET --network fuji
    ```
    Expected output:

    ``` shell
    Proxy Address: 0x50E8ECf5b062632E539289208746aba5167191F0
    ```
9.  We can confirm that the operator, and x and y point matches the deployed and computed proxy address.

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

    Confirm that owner does not exist yet on the destination chain.
    ``` shell
    npx hardhat getOwnerOfSnickerdoodleWallet --snickerdoodlewalletaddress 0x50E8ECf5b062632E539289208746aba5167191F0 --network basesepolia
    ```
    Expected output:

    ``` shell
    Operator: 0x0000000000000000000000000000000000000000
    Passkey point X: 0x0000000000000000000000000000000000000000000000000000000000000000
    Passkey point Y: 0x0000000000000000000000000000000000000000000000000000000000000000
    Passkey Id: 
    ```

10. Before claiming the wallet on the destination chain, we get a quote of the fees to send that message from our source chain.
    ``` shell
    npx hardhat quoteClaimSnickerdoodleWalletOnDestinationChain --destinationchainid 40245 --name MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --gas 120000 --snickerdoodlewalletaddress 0x50E8ECf5b062632E539289208746aba5167191F0 --network fuji
    ```
    Expected output:

    ``` shell
    Quoted price: Result(2) [ 19472638481936229n, 0n ]
    ```

11. Now, we initiate a layer zero call from the source to the destination chain to claim the wallet on the destination chain. Using the quote above as the fee in wei. If the transaction is successful, Layer Zero will also send a message to the destination chain to update the owner of the Snickerdoodle wallet address.
    
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
    npx hardhat claimSnickerdoodleWalletAddressOnDestinationChain --destinationchaineid 40245 --walletname MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --gas 100000 --feeinwei 19472638481936229 --network fuji
    ```
    Expected output:

    ``` shell
    Wallet claimed request submitted to destination chain! Txhash: 0x1542267728fe709f242d88ec72697c7c1688dc4bc786bd5267f35bec70678733
    ```

12. Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Mumbai) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0x1542267728fe709f242d88ec72697c7c1688dc4bc786bd5267f35bec70678733). This process took about 2 minutes to reach the complete status.
13. Repeat the Snickerdoodle wallet ownership check on the source and destination chains to confirm that Layer Zero has updated the destination chain's status.

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

14. Finally, we can now create a Snickerdoodle wallet on the destination chain.

    ``` shell
    npx hardhat deploySnickerdoodleWalletUpgradeableBeacon --name MYSnickerdoodleWALLET --qx 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZshG7RuJhiObFTQ --network basesepolia
    ```
    Expected output:
    ``` shell
    Snickerdoodle wallet deployed!
    Transaction receipt...
    ```
    

