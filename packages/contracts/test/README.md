# Contract Unit Tests

Unit tests are based on [Hardhat's version](https://hardhat.org/hardhat-runner/docs/guides/test-contracts) of the [Chai](https://www.chaijs.com/) assertion library. Each contract has its own testing script.

Run all tests:

```shell
npx hardhat test
```
Only run tests in a given file:
```shell
npx hardhat test test/consent.js

```

# Testing OFT20Rewards

OFTs (Omnichain Fungible tokens) allow us to bridge tokens between contracts on different chains. 

For this example, we will deploy and transfer OFT20Rewards from the Fuji testnet to Mumbai testnet. OFT20Rewards are based on the Layer Zero's (LZ) OFT V2 implementation [here](https://layerzero.gitbook.io/docs/evm-guides/contract-standards/oft-overview).

Both contracts will be similar so that we would be able to transfer OFTs between them (ie. they both have the same LZ sending and receiving implementations).

NOTE: Before proceeding, make necessary `.env` updates with the private key of the signing account and fund the accounts with native tokens of the chains to be tested on in this example.

1. Set the correct the LZ endpoint address and OFT token params before the contract deployments in this file: `scripts/deploy-oft20reward.js`. The list of endpoint values can be found [here](https://docs.layerzero.network/contracts/endpoint-addresses).

2. Once the params are set correctly, deploy the OFT20Reward to Fuji testnet:
	```shell
	npx  hardhat  run  scripts/deploy-oft20reward.js  --network  fuji
	```
	 Expected output:
	```shell
	Deploying  OFT20Reward  contract...
	OFT20Reward  deployed  to:  0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895  on  fuji
	OFT20Reward  Gas  Fee:  4373413
	OFT20Reward  Contract  deployment  successful!

	```

3. Repeat step 1 and now deploy to Mumbai testnet:
	```shell
	npx hardhat run scripts/deploy-oft20reward.js --network mumbai
	```
	 Expected output:
	```shell
	Deploying OFT20Reward contract...
	OFT20Reward deployed to: 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f on mumbai
	OFT20Reward Gas Fee: 4373413
	OFT20Reward Contract deployment successful!

	```
4. We then need to call `setPeer` to hook the contracts together. This step basically tells the contracts which contract they are connected to on the other chain.  The list of endpoint values can be found [here](https://docs.layerzero.network/contracts/endpoint-addresses). 

	The respective peer contract addresses are the contract addresses deployed above.
	
	Mumbai's endpoint id is 40109
	Fuji's endpoint id is 40106

	Call `setPeer` on the Fuji contract to point to the Mumbai contract:
	```shell
	npx hardhat oft20SetPeer --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --peercontract 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --eid 40109 --network fuji
	```
	Call `setPeer` on the Mumbai contract to point to the Fuji contract:
	
	```shell
	npx hardhat oft20SetPeer --currentcontract  0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --peercontract0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --eid 40106 --network mumbai
	```
	
5. Check that both contracts are each others' peers, both should return `true`:
	```shell
	npx hardhat oft20IsPeer --currentcontract  0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --peercontract  0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --eid 40109  --network  fuji
	```

		npx hardhat oft20IsPeer --currentcontract 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --peercontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --eid 40106 --network mumbai

6. Mint some tokens on the Fuji contract. In this case, we are minting to the second address in the signing account (0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D). Update the `to` argument appropriately. 
	```shell
	npx hardhat oft20Mint --to 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --amountinethers 1.5 --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895  --network fuji
	```
7. Confirm that it the tokens were minted by checking the balance:
	```shell
	npx hardhat oft20BalanceOf --addresstocheck 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
	```

8. Get a quote of the fees to call `send()`. Note that for this call, the script calls its the second account (0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D)  and its intending to transfer the tokens to the thrid wallet address of the signing account (0x53901c30c84C2cD3dE5Ca02ed1860CeB3a9A3776). 
	```
	npx hardhat oft20QuoteSend --eid 40109 --currentcontract  0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
	```
	Expected output: 
		
		[
		  BigNumber { value: "3906693045811987" },
		  BigNumber { value: "0" },
		  nativeFee: BigNumber { value: "3906693045811987" },
		  lzTokenFee: BigNumber { value: "0" }
		]	
	
	In the `tasks/layer-zero-rewards.js` file, under the `oft20Send` task, update the `messagingFee` object with this value in its `nativeFee` property.
		
9. The setup is now complete! We can call `send` to initiate a token burn on the Fuji contract and send a message to LZ to mint the equal amount on the Mumbai contract. 

	```shell
	npx hardhat oft20Send --eid 40109 --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
	```
	Expected output: 
		
		{
		  hash: '0x05b8bf9c46a44faa005d2eb93f567167af2d69725dede31f7537554e0deb27c5',
		  ...
	  
	Using the hash, we can copy the transaction hash and check the status of the message sent to LZ (and ultimately to the contract on Mumbai) via the scanner like [this](https://testnet.layerzeroscan.com/tx/0x05b8bf9c46a44faa005d2eb93f567167af2d69725dede31f7537554e0deb27c5). This process took about 4 minutes to reach the complete status. 

10. Now we can confirm that it is burnt on Fuji by checking the balance of the address we minted tokens to:

	```shell
	npx hardhat oft20BalanceOf --addresstocheck 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
	```

11. We finally can confirm that Confirm that it is minted on Mumbai by checking the balance of the address we transferred the tokens to. 

	```shell
	npx hardhat oft20BalanceOf --addresstocheck 0x53901c30c84C2cD3dE5Ca02ed1860CeB3a9A3776 --currentcontract 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --network mumbai
	```

  
# Testing ONFT721Reward

ONFTs (Omnichain Non-fungible tokens) allow us to bridge non-fungible tokens between contracts on different chains. 

For this example, we will deploy and transfer ONFT721Rewards from the Fuji testnet to Mumbai testnet. ONFT721Rewards are based on the Layer Zero's (LZ) ONFT V1 implementation [here](https://layerzero.gitbook.io/docs/evm-guides/contract-standards/onft-overview).

1. Similar to steps in OFT above, update the `lzEndpoint` address in `scripts/deploy-onft721reward.js`. The endpoint ids and addresses can be found [here](https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses).

2. Once the params in the deployment file are set. Deploy to Fuji:
	```shell
	npx hardhat run scripts/deploy-onft721reward.js --network fuji
	```
	Expected output:
	```shell
	Deploying ONFT721Reward contract...
	ONFT721Reward deployed to: 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc on fuji
	ONFT721Reward  Gas  Fee:  5077251
	ONFT712Reward  Contract  deployment  successful!
	```

3. Update the `lzEndpoint` address in `scripts/deploy-onft721reward.js` for Mumbai and deploy: 
	```shell
	npx hardhat run scripts/deploy-onft721reward.js --network mumbai
	```
	Expected output:
	```shell
	Deploying  ONFT721Reward  contract...
	ONFT721Reward  deployed  to:  0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E  on  mumbai
	ONFT721Reward  Gas  Fee:  5077251
	ONFT712Reward  Contract  deployment  successful!
	```

4. Mint an reward NFT on the Fuji contract. In this example, we mint a token to the second address of the signing account. Currently, the token id increments and starts from id 0. To we are minting token 0 to 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D. 
	```shell
	npx  hardhat  onft721SafeMint  --network  fuji  --to  0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D  --rewardaddress  0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc
	```

5. Check that its minted. The expected output should show the address we minted the token to (0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D). 
	```shell
	npx hardhat onft721OwnerOf --network fuji --tokenid 0 --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc
	```

6. Check that the token id doesn't exist on the Mumbai contract:
```shell
npx  hardhat  onft721OwnerOf  --network  mumbai  --tokenid  0  --rewardaddress  0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E
```

7. In LZ V1 instead of `setPeer`, we call `setTrustedRemoteAddress` and `setTrustedRemote` to connect the contracts together.

	Set the trusted remote address on Fuji:
	```shell
	npx hardhat onft721SetTrustedRemoteAddress --network fuji --rewardaddress  0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --chainid 10109 --peeraddress  0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E
	```
	Set the trusted remote address on Mumbai:
	```shell
	npx hardhat onft721SetTrustedRemoteAddress --network mumbai --rewardaddress  0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E --chainid 10106 --peeraddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc
	```
	Set the trusted remote on Fuji:
	```shell
	npx hardhat onft721SetTrustedRemote --network fuji --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --peeraddress 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E --destinationchainid 10109
	```
	Set the trusted remote on Mumbai:
	```shell
	npx hardhat onft721SetTrustedRemote --network mumbai --rewardaddress 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E --peeraddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --destinationchainid 10106
	```
8. We then set the minimum gas to call the function on the destination contract. Note this is the minimum gas needed to call the function that actually mints the token (ie. the transfer (from zero address to the receiver)  or the mint function)
	```shell
	npx hardhat onft721SetMinDstGas --network fuji --rewardaddress  0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --destinationchainid 10109 --packagetype 1 --mingas 100000
	```
9. The setup is not complete and we can make the `crossChain` call. The gas param here is the amount we're estimating to call `_lzReceive` on the destination contract. Ensure that this is higher than the minimum gas value above. 

	```shell
	npx hardhat onft721CrossChain --network fuji --rewardaddress  0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --from  0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --to  0x53901c30c84C2cD3dE5Ca02ed1860CeB3a9A3776 --tokenid 0 --destinationchainid 10109 --gas 500000
	```
10. Check that the token id is burnt on the Fuji contract. We will see the ERC721 error stating that the token id no longer exists.
	```shell
	npx  hardhat  onft721OwnerOf  --network  fuji  --tokenid  0  --rewardaddress  0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc
	```
11. Check that its minted on Mumbai contract. The owner should be 0x53901c30c84C2cD3dE5Ca02ed1860CeB3a9A3776. 

	```shell
	npx  hardhat  onft721OwnerOf  --network  mumbai  --tokenid  0  --rewardaddress  0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E
	```