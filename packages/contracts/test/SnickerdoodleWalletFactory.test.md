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

OperatorGatewayModule#OperatorGateway - 0x1dfe41a116Cd5493Df58519d6491b9E5d43c8D57
SnickerdoodleFactoryModule#SnickerdoodleFactory - 0x1ba34f9B0efbf1d79f17c3eeCEeed7627075024F
SnickerdoodleWalletModule#SnickerdoodleWallet - 0x946F2cC7401033AF38537D5aD7e3eBA0ed326f91
OperatorGatewayModule#UpgradeableBeacon - 0x9A4f55bd9B7DB612765d1Ef8aEA27433985f87D9
SnickerdoodleFactoryModule#TransparentUpgradeableProxy - 0x1CCe1F39f413B87Ba30322bcd42d4561b697079F
SnickerdoodleWalletModule#UpgradeableBeacon - 0x38539F930616228e5F9d7060d2eA639216C4e6a9
SnickerdoodleFactoryModule#SnickerdoodleFactoryProxy - 0x1CCe1F39f413B87Ba30322bcd42d4561b697079F
SnickerdoodleFactoryModule#ProxyAdmin - 0x27AA1bE1fA7Ba2e6170494236C2256815c0fa0B9
   ```

    ```shell
    npx hardhat ignition deploy ignition/modules/SnickerdoodleFactory.ts --network basesepolia --strategy create2 --reset
    ```

   Expected output:
   ```shell
   Deployed Addresses
OperatorGatewayModule#OperatorGateway - 0x1dfe41a116Cd5493Df58519d6491b9E5d43c8D57
SnickerdoodleFactoryModule#SnickerdoodleFactory - 0x1ba34f9B0efbf1d79f17c3eeCEeed7627075024F
SnickerdoodleWalletModule#SnickerdoodleWallet - 0x946F2cC7401033AF38537D5aD7e3eBA0ed326f91
OperatorGatewayModule#UpgradeableBeacon - 0x9A4f55bd9B7DB612765d1Ef8aEA27433985f87D9
SnickerdoodleFactoryModule#TransparentUpgradeableProxy - 0x1CCe1F39f413B87Ba30322bcd42d4561b697079F
SnickerdoodleWalletModule#UpgradeableBeacon - 0x38539F930616228e5F9d7060d2eA639216C4e6a9
SnickerdoodleFactoryModule#SnickerdoodleFactoryProxy - 0x1CCe1F39f413B87Ba30322bcd42d4561b697079F
SnickerdoodleFactoryModule#ProxyAdmin - 0x27AA1bE1fA7Ba2e6170494236C2256815c0fa0B9
   ```
   Because we deployed using the create2 strategy, it should produce the same contract addresses on both chains. 

   Sample SnickerdoodleFactory's Proxy address deployed on [Fuji](https://testnet.snowtrace.io/address/0x1CCe1F39f413B87Ba30322bcd42d4561b697079F) and [Base Sepolia](https://sepolia.basescan.org/address/0x1CCe1F39f413B87Ba30322bcd42d4561b697079F): `0x1CCe1F39f413B87Ba30322bcd42d4561b697079F`

1. Update the `SNICKERDOODLE_WALLET_FACTORY` in [SnickerdoodleWallet.ts](/tasks/SnickerdoodleWallet.ts#L3) with the SnickerdoodleFactoryModule#TransparentUpgradeableProxy's address deployed above for the Hardhat tasks to work correctly.

2. We then need to call `setPeer` to connect the contracts together. The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts). We need to do this step for all destination chain ids we want to connect.

   The respective peer contract addresses are the contract addresses deployed above.

    - Amoy's endpoint id is `40267`
    - Fuji's endpoint id is `40106`
    - Base Sepolia's endpoint id is `40245`

   Call `setPeer` on the Fuji contract to point to the Amoy contract:
   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0x1CCe1F39f413B87Ba30322bcd42d4561b697079F --peercontract 0x1CCe1F39f413B87Ba30322bcd42d4561b697079F --eid 40245 --network fuji
   ```
   Call `setPeer` on the Amoy contract to point to the Fuji contract:

   ```shell
   npx hardhat snickerdoodleWalletFactorySetPeer --currentcontract 0x1CCe1F39f413B87Ba30322bcd42d4561b697079F --peercontract 0x1CCe1F39f413B87Ba30322bcd42d4561b697079F --eid 40106 --network basesepolia
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
    hash: '0x41725049935086bd5d8bd6cd3fd589e20ce8c3a163400a70a51e2d892f4e33ae'
    ...
   ```
   Use the transaction hash to obtain the address that the OperatorGatewayProxy was deployed to. For example, the deployed contract address is [0x630Fa323aB5C98e2546B8589B18A0FB89a16c5ed](https://testnet.snowtrace.io/tx/0x41725049935086bd5d8bd6cd3fd589e20ce8c3a163400a70a51e2d892f4e33ae). Update the OPERATOR_GATEWAY_PROXY variable [here](./tasks/snickerdoodleFactory.ts#L7). Now some that hardhat tasks will act as an operator that owns the `snickerdoodle` domain.

4. We can also cross check the deployed address of the Operator Gateway Proxy using the command below:
    ``` shell
    npx hardhat computeOperatorGatewayProxyAddress --domain snickerdoodle --network fuji
    ```
    Expected output:

    ``` shell
    Operator gateway proxy address: 0x630Fa323aB5C98e2546B8589B18A0FB89a16c5ed
    ```
5. We can confirm that it has been deployed on the source chain using the command below: 
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0x630Fa323aB5C98e2546B8589B18A0FB89a16c5ed --network fuji
    ```
    Expected output 
    ```shell
    Operator gateway params:
    - Domain: snickerdoodle
    - Operator Accounts: No operator accounts
    ```
    We can also confirm that there is no param set on the destination chain.
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0x630Fa323aB5C98e2546B8589B18A0FB89a16c5ed --network basesepolia
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
    Quoted price: Result(2) [ 12999601371022226n, 0n ]
    ```
7.  Now we try to send a message to the destination chain to reserve it. Include the quoted price above into the `feeinwei` argument 

    ``` shell
    npx hardhat reserveOperatorGatewayOnDestinationChain --destinationchaineid 40245 --domain snickerdoodle --gas 90000 --feeinwei 12999601371022226 --network fuji
    ```
    Expected output: 
    ```shell
    Operator domain reserve request submitted to destination chain! Txhash: ContractTransactionReceipt ...
    hash: '0x1a72aa78dd7960d6ec75d7b99edf4ce14b8929ef481596983412efafcd7344ba',
    ...
    ```
8.  Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Base Sepolia) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0x1a72aa78dd7960d6ec75d7b99edf4ce14b8929ef481596983412efafcd7344ba). This process took about 2 minutes to reach the complete status.    
9.  Now we can confirm that the message was sent by checking the operator details again. 
    ```shell
    npx hardhat getDeployedOperatorGatewayProxyDetails --operatoraddress 0x630Fa323aB5C98e2546B8589B18A0FB89a16c5ed --network basesepolia
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

  hash: '0xa1649898fa83aa92da2caf85b0acf0a11f3c82be5395e6c189dc3de15005548d',
  ```
12. Next is to work with the wallets. We can get the wallet params this way.

    Compute the Snickerdoodle wallet proxy address for a given username, say `MYSnickerdoodleWALLET.snickerdoodle`.
    ``` shell
    npx hardhat computeWalletProxyAddress --usernamewithdomain MYSnickerdoodleWALLET.snickerdoodle --network fuji
    ```
    Expected output:

    ``` shell
    Wallet proxy address: 0xE3D5Ff1799ed8Ba72f47dDD746FA41CC2d76aaf9
    ```
    Check the wallet params on the contracts for both `basesepolia` and `fuji`: 
    ```shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xE3D5Ff1799ed8Ba72f47dDD746FA41CC2d76aaf9 --network basesepolia
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
    hash: '0x179e814a3a0596445b2466906acf92b90c103578aa48b2bbddd9f17bf929ce97',
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
15. We can confirm that the wallet params, and x and y point matches the deployed and computed proxy address.

    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xE3D5Ff1799ed8Ba72f47dDD746FA41CC2d76aaf9 --network fuji
    ```
    Expected output:

    ``` shell
    Wallet params:
    - Operator: 0x630Fa323aB5C98e2546B8589B18A0FB89a16c5ed
    - Name: MYSnickerdoodleWALLET.snickerdoodle
    - P256 details:
    - X: 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5
    - Y: 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f
    - Key Id: TAp_FZMZshG7RuJhiObFTQ
    EVM Accounts: No EVM accounts
    ```

    Confirm that owner does not exist yet on the destination chain.
    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xE3D5Ff1799ed8Ba72f47dDD746FA41CC2d76aaf9 --network basesepolia
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
    npx hardhat quoteReserveWalletOnDestinationChain --destinationchainid 40245 --namewithdomain MYSnickerdoodleWALLET.snickerdoodle --operator 0x630Fa323aB5C98e2546B8589B18A0FB89a16c5ed --gas 80000 --network fuji
    ```
    Expected output:

    ``` shell
    Quoted price: Result(2) [ 22911924217113268n, 0n ]
    ```

17. Now, we initiate a layer zero call from the source to the destination chain to claim the wallet on the destination chain. Using the quote above as the fee in wei. If the transaction is successful, Layer Zero will also send a message to the destination chain to update the owner of the Snickerdoodle wallet address.
    
    ``` shell
    npx hardhat reserveWalletAddressOnDestinationChainViaOperatorGateway --destinationchaineid 40245 --username MYSnickerdoodleWALLET --gas 300000 --feeinwei 22911924217113268 --network fuji
    ```
    Expected output:

    ``` shell
    Wallet reserve request submitted to destination chain! Txhash: 0xf4160f73f60af5c04986e70a12acb1ebdc503c563c96de29eebc8e13633f0be5
    ```

17. Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Mumbai) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0xf4160f73f60af5c04986e70a12acb1ebdc503c563c96de29eebc8e13633f0be5). This process took about 2 minutes to reach the complete status.

18. Repeat the Snickerdoodle wallet ownership check on the source and destination chains to confirm that Layer Zero has updated the destination chain's status.

    ``` shell
    npx hardhat getDeployedWalletProxyDetails --walletaddress 0xE3D5Ff1799ed8Ba72f47dDD746FA41CC2d76aaf9 --network basesepolia
    ```

    Expected output: 
    
    ``` shell
    Wallet params:
    - Operator: 0x630Fa323aB5C98e2546B8589B18A0FB89a16c5ed
    - Name: MYSnickerdoodleWALLET.snickerdoodle
    - P256 details:
    - X: 0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5
    - Y: 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f
    - Key Id: TAp_FZMZshG7RuJhiObFTQ
    EVM Accounts: No EVM accounts
    ```

19. Finally, we can now create a Snickerdoodle wallet on the destination chain.

    ``` shell
    npx hardhat deploySnickerdoodleWalletProxyViaOperatorGateway --username MYSnickerdoodleWALLET --qx
    0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5 --qy 0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f --keyid TAp_FZMZ
    shG7RuJhiObFTQ --network basesepolia
    ```
    Expected output:
    ``` shell
    Snickerdoodle wallet deployed!
    Transaction receipt ContractTransactionReceipt
    ...
    hash: "0xce7da260838cb6d521f60deec58a05595f1c4529c048e8c205a90c965d513a57"
    ...
    ```
    

