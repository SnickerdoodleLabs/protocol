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

## Testing Layer Zero OFT

Depending on the chain, change the Layer Zero endpoint address on deployment.

Let's say deploy to Fuji testnet... 

npx hardhat run scripts/deploy-oft20reward.js --network fuji

Deploying OFT20Reward contract...
OFT20Reward deployed to: 0x2b3f591B8F03cA20A6D43636128e942364d383F0 on fuji 

ONFT721Reward Gas Fee: 4373413

OFT20Reward Contract deployment successful!

Now deploy to Sepolia testnet... 

npx hardhat run scripts/deploy-oft20reward.js --network sepolia  

Deploying OFT20Reward contract...
OFT20Reward deployed to: 0x1F9a2e47abA4A6BF2B6A92F8ffa7B2fDc1b17B0f on sepolia
ONFT721Reward Gas Fee: 4373413

OFT20Reward Contract deployment successful!

Then setPeer to connect them.. 
First edit the contract address in tasls/layer-zero-rewards.js...

On the fuji contract: 
sepolia eid is 40161
peerContract is 0x1F9a2e47abA4A6BF2B6A92F8ffa7B2fDc1b17B0f

On the sepolia contract: 
fuji is is 40106
peerContract is 0x2b3f591B8F03cA20A6D43636128e942364d383F0

npx hardhat setPeer --eid 40161 --peercontract 0x1F9a2e47abA4A6BF2B6A92F8ffa7B2fDc1b17B0f --currentcontract 0x2b3f591B8F03cA20A6D43636128e942364d383F0 --network fuji

----TX Mined---
Blocknumber: 30806747
TX Hash: 0x7a7af35b9e657eef625d063d8d511274ef2352a71b09d8e5df05197dbcc1ecfc
Gas Used: 47667

npx hardhat setPeer --eid 40106 --peercontract 0x2b3f591B8F03cA20A6D43636128e942364d383F0 --currentcontract 0x1F9a2e47abA4A6BF2B6A92F8ffa7B2fDc1b17B0f --network sepolia

----TX Mined---
Blocknumber: 5470661
TX Hash: 0xfd737467e02ecca792a730fc55675c5ebe17c983480083c3d9625204b9f55af1
Gas Used: 47667

...hitting Slippage exceeded error

ONFT721 testing.. 


Deploy onto fuji

npx hardhat run scripts/deploy-onft721reward.js --network fuji  

Deploying ONFT721Reward contract...
ONFT721Reward deployed to: 0x48D429866257db324099377d7b84C8e961DF0479  on  fuji
ONFT721Reward Gas Fee: 2809504

ONFT712Reward Contract deployment successful!

npx hardhat run scripts/deploy-onft721reward.js --network mumbai  


Deploying ONFT721Reward contract...
ONFT721Reward deployed to: 0x2b3f591B8F03cA20A6D43636128e942364d383F0  on  mumbai
ONFT721Reward Gas Fee: 2809504

ONFT712Reward Contract deployment successful!

mint a token..

npx hardhat onft721SafeMint --network fuji --to 0x416d466B25f4d404263862889463f4e93Ee6c3FB --rewardaddress 0x48D429866257db324099377d7b84C8e961DF0479   

----TX Mined---
Blocknumber: 30810408
TX Hash: 0x3f1b2d7aeffbf28025ccf53547b00b773de394f049edf4a1532bb059a6c66a7a
Gas Used: 96165

check that its minted

npx hardhat onft721OwnerOf --network fuji --tokenid 0 --rewardaddress 0x48D429866257db324099377d7b84C8e961DF0479  


cross chain call! 

npx hardhat onft721CrossChain --network fuji --tokenid 0 --rewardaddress 0x48D429866257db324099377d7b84C8e961DF0479 --destinationchainid 10109 --destinationaddress 0x2b3f591B8F03cA20A6D43636128e942364d383F0