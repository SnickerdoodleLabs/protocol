
# User Smart Wallet

Layer Zero's OApps (Omnichain Apps) allow us to send messages between contracts on different chains. By having the Smart Wallet contracts inherits the OApp, it allows the Smart Wallet contracts deployed on different chains to update each other's states via messages. Below is a diagram of how the Smart Wallet contracts work.

![Alt text](./layerZeroSmartWallet.png)

For this example, we will deploy SmartWalletFactory contracts on the Fuji testnet to Amoy testnet. SmartWalletFactory contracts inherits the OApp contract based on the Layer Zero's (LZ) V2 implementation [here](https://docs.layerzero.network/v2/developers/evm/oapp/overview).

Both contracts will be similar so that we would be able to send and receive messages between them (ie. they both have the same LZ sending and receiving implementations).

Start by cloning the repo and installing the dependencies. 

```sh
git clone https://github.com/SnickerdoodleLabs/smart-wallet-example.git
cd smart-wallet-example
npm install
```

NOTE: Before proceeding, make necessary `.env` updates with the private key of the signing account and fund the accounts with native tokens of the chains to be tested on in this example.

## Testing the SmartWalletFactory (with Hardhat Tasks)

1. Set the correct the LZ endpoint address and owner params before the contract deployments in the [SmartWalletFactory.ts](/ignition/modules/SmartWalletFactory.ts#L6). The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts).

2. Once the params are set correctly, deploy the SmartWalletFactory to Fuji and Amoy testnets:
	```shell
    npx hardhat ignition deploy ignition/modules/SmartWalletFactory.ts --network fuji --strategy create2 --reset
    ```

	Expected output:
	```shell
	Deployed Addresses

    SmartWalletModule#SmartWalletFactory - 0x9AfB3AC96078B6415230A708247720dc5F908a8A
	```

    ```shell
    npx hardhat ignition deploy ignition/modules/SmartWalletFactory.ts --network amoy --strategy create2 --reset
    ```

	Expected output:
	```shell
	Deployed Addresses

    SmartWalletModule#SmartWalletFactory - 0x9AfB3AC96078B6415230A708247720dc5F908a8A
	```

    Sample SmartWalletFactory addresses deployed on [Fuji](https://testnet.snowtrace.io/address/0x9AfB3AC96078B6415230A708247720dc5F908a8A) and [Amoy](https://amoy.polygonscan.com/address/0x9AfB3AC96078B6415230A708247720dc5F908a8A): `0x9AfB3AC96078B6415230A708247720dc5F908a8A`

3. Update the `SMART_WALLET_FACTORY` in [smartWallet.ts](/tasks/smartWallet.ts#L3) with any newly deployed contract address for the Hardhat tasks to work correctly. 

4. We then need to call `setPeer` to hook the contracts together. This step basically tells the contracts which contract they are connected to on the other chain.  The list of endpoint values can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts). We need to do this step for all destination chain ids we want to connect.  

	The respective peer contract addresses are the contract addresses deployed above.
	
	- Amoy's endpoint id is 40267
	- Fuji's endpoint id is 40106

	Call `setPeer` on the Fuji contract to point to the Amoy contract:
	```shell
	npx hardhat smartWalletFactorySetPeer --currentcontract 0x9AfB3AC96078B6415230A708247720dc5F908a8A --peercontract 0x9AfB3AC96078B6415230A708247720dc5F908a8A --eid 40267 --network fuji
	```
	Call `setPeer` on the Amoy contract to point to the Fuji contract:
	
	```shell
	npx hardhat smartWalletFactorySetPeer --currentcontract 0x9AfB3AC96078B6415230A708247720dc5F908a8A --peercontract 0x9AfB3AC96078B6415230A708247720dc5F908a8A --eid 40106 --network amoy
	```

5. Compute the smart wallet proxy address for a given name. 
    ``` shell
	npx hardhat computeSmartWalletProxyAddress --name MYSMARTWALLET --network fuji
	```
	Expected output: 

    ``` shell
	Proxy Address: 0xF276C7b9D892DC2f9308e7966ce1793385C8AFeC
	```
   
6. Using the calculated smart wallet proxy address generated for the desired wallet name, we can get a quote of the fees to call `_lzSend()`. This is a required fee (paid in native tokens) for the Layer Zero protocol to send the message. 

	``` shell
	npx hardhat getSendQuote --eid 40267 --currentcontract 0x9AfB3AC96078B6415230A708247720dc5F908a8A --owner 0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7 --smartwalletaddress 0xF276C7b9D892DC2f9308e7966ce1793385C8AFeC --network fuji
	```
	Expected output: 

    ``` shell
	Quoted price: [ 7734932340977759n, 0n ]
	```

7. We can check and confirm that there indeed is no owner for the smart wallet address on the contracts. 

    Running this command gets the owner of the smart wallet address on the Fuji contract.
   	``` shell
	npx hardhat getOwnerOfSmartWallet --smartwalletaddress 0xF276C7b9D892DC2f9308e7966ce1793385C8AFeC --network fuji
	```
	Expected output: 

    ``` shell
    Owner address: 0x0000000000000000000000000000000000000000
	```

    Running this command gets the owner of the smart wallet address on the Amoy contract.
   	``` shell
	npx hardhat getOwnerOfSmartWallet --smartwalletaddress 0xF276C7b9D892DC2f9308e7966ce1793385C8AFeC --network amoy
	```
	Expected output: 

    ``` shell
    Owner address: 0x0000000000000000000000000000000000000000
	```

8.  Try deploying a smart wallet on a destination chain, it will fail as the smart wallet address has not been created on the source chain.
	```shell
	npx hardhat deploySmartWalletUpgradeableBeacon --name MYSMARTWALLET --owner 0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7 --currentcontract 0x9AfB3AC96078B6415230A708247720dc5F908a8A --eid 40267 --valueinwei 7734932340977759 --network amoy
	```

    Expected output:
	```shell
    TransactionExecutionError: Execution reverted with reason: SmartWalletFactory: Smart wallet with selected name has not been created on the source chain.
	```

9.  Now try creating the smart wallet on the source chain. If the transaction is successful, Layer Zero will also send a message to the destination chain to update the owner of the smart wallet address. 
	```shell
	npx hardhat deploySmartWalletUpgradeableBeacon --name MYSMARTWALLET --owner 0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7 --currentcontract 0x9AfB3AC96078B6415230A708247720dc5F908a8A --eid 40267 --valueinwei 7734932340977759 --network fuji
	```
    Expected output: 
	```shell
		{
          transactionHash: '0x2147dc392eafb59b658b54af51b2f8446c8680387758d2568ea571c053b21147',
          ...
        }
    ```

10.  Using the transaction hash, check the status of the message sent to LZ (and ultimately to the contract on Mumbai) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0x2147dc392eafb59b658b54af51b2f8446c8680387758d2568ea571c053b21147). This process took about 2 minutes to reach the complete status.

11.   Repeat the smart wallet ownership check on the source and destination chains to confirm that Layer Zero has updated the destination chain's status.

   	``` shell
	npx hardhat getOwnerOfSmartWallet --smartwalletaddress 0xF276C7b9D892DC2f9308e7966ce1793385C8AFeC --network fuji
	```

	Expected output: 

    ``` shell
    Owner address: 0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7
	```

    Running this command gets the owner of the smart wallet address on the Amoy contract.
   	``` shell
	npx hardhat getOwnerOfSmartWallet --smartwalletaddress 0xF276C7b9D892DC2f9308e7966ce1793385C8AFeC --network amoy
	```
	Expected output: 

    ``` shell
    Owner address: 0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7
	```
	
12.   Finally, we can now create a smart wallet on the destination chain. 
    
	```shell
	npx hardhat deploySmartWalletUpgradeableBeacon --name MYSMARTWALLET --owner 0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7 --currentcontract 0x9AfB3AC96078B6415230A708247720dc5F908a8A --eid 40267 --valueinwei 7846711690236811 --network amoy
	```

13.   Optional! We can also use the event checker script to confirm the deployed proxy address. Setup the correct params like block number (using the output from the step 7) to target the correct SmartWalletCreated event
   ``` shell
   npx hardhat run scripts/getPastEvents.ts  
   ```
   Expected output:
   ``` shell
    Fetching events from block 35016345 to 35016365...
    Found 1 event(s):
    Event 1:
    Smart Wallet Address: 0xF276C7b9D892DC2f9308e7966ce1793385C8AFeC
    Block Number: 35016355
    Transaction Hash: 0x5e1d04195a6663ce353eb2379909295796c900fc318d27f05eae2534c453a519
    Log Index: undefined
   ```
    
