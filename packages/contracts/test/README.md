# Testing Layer Zero OFT

Depending on the chain, change the Layer Zero endpoint address on deployment.

Deploy to Fuji testnet... 

```shell
npx hardhat run scripts/deploy-oft20reward.js --network fuji
```

```shell
Deploying OFT20Reward contract...
OFT20Reward deployed to: 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 on fuji 

ONFT721Reward Gas Fee: 4373413

OFT20Reward Contract deployment successful!
```

Now deploy to Mumbai testnet... 

```shell
npx hardhat run scripts/deploy-oft20reward.js --network mumbai  
```

```shell
Deploying OFT20Reward contract...
OFT20Reward deployed to: 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f on mumbai
ONFT721Reward Gas Fee: 4373413

OFT20Reward Contract deployment successful!
```

Then call setPeer to connect them... 

First edit the contract address in tasks/layer-zero-rewards.js...

On the fuji contract: 
-Mumbai eid is 40109
-peerContract is 0x1F9a2e47abA4A6BF2B6A92F8ffa7B2fDc1b17B0f

On the Mumbai contract: 
-Fuji eid is 40106
-peerContract is 0x3B6ac7880fe1F42F933A31096fDE354A5a929A1F

Connect the Fuji contract to the Mumbai contract... 
```shell
npx hardhat oft20SetPeer --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --peercontract 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --eid 40109 --network fuji
```

Connect the Mumbai contract to the Fuji contract...
```shell
npx hardhat oft20SetPeer --currentcontract 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --peercontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --eid 40106 --network mumbai
```

Check the Fuji contract if the Mumbai contract is its peer... 
```shell
npx hardhat oft20IsPeer --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --peercontract 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --eid 40109 --network fuji
```

Connect the Mumbai contract if the Fuji contract is its peer...
```shell
npx hardhat oft20IsPeer --currentcontract 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --peercontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --eid 40106 --network mumbai

Mint some tokens on the Fuji contract...
```shell
npx hardhat oft20Mint --to 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --amountinethers 1.5 --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
```

Confirm that it is minted... 
```shell
npx hardhat oft20BalanceOf --addresstocheck 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
```

Get a quote of the fees to send before calling the send function...
```shell
npx hardhat oft20QuoteSend --eid 40109 --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
```

Now that they are connected, we can call send!

Get a quote of the fees to send before calling the send function...
```shell
npx hardhat oft20Send --eid 40109 --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
```

Confirm that it is burnt on Fuji... 
```shell
npx hardhat oft20BalanceOf --addresstocheck 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --currentcontract 0x7392De6e8D92b96C44Bcc1d1Df24DB8622fBA895 --network fuji
```

Confirm that it is minted on Mumbai... 
```shell
npx hardhat oft20BalanceOf --addresstocheck 0x53901c30c84C2cD3dE5Ca02ed1860CeB3a9A3776 --currentcontract 0x5d2fD6ab726c84D29494C44c65D3e64B35e67F7f --network mumbai
```


# Testing Layer Zero ONFT

Update the lzEndpoint address in scripts/deploy-onft721reward.js
Deploy to fuji

```shell
npx hardhat run scripts/deploy-onft721reward.js --network fuji  
```

```shell
Deploying ONFT721Reward contract...
ONFT721Reward deployed to: 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc  on  fuji
ONFT721Reward Gas Fee: 5077251

ONFT712Reward Contract deployment successful!
```

Update the lzEndpoint address in scripts/deploy-onft721reward.js
Deploy to mumbai 

```shell
npx hardhat run scripts/deploy-onft721reward.js --network mumbai  
```

```shell
Deploying ONFT721Reward contract...
ONFT721Reward deployed to: 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E  on  mumbai
ONFT721Reward Gas Fee: 5077251

ONFT712Reward Contract deployment successful!
```

Mint a token on the fuji contract...

```shell
npx hardhat onft721SafeMint --network fuji --to 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc   
```

Check that its minted...

```shell
npx hardhat onft721OwnerOf --network fuji --tokenid 0 --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc  
```
Check that it doesnt exist on the mumbai contract
```shell
npx hardhat onft721OwnerOf --network mumbai --tokenid 0 --rewardaddress 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E 
```

Set the trusted remote address to connect them to each other... 
```shell
npx hardhat onft721SetTrustedRemoteAddress --network fuji --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --chainid 10109 --peeraddress 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E
```

```shell
npx hardhat onft721SetTrustedRemoteAddress --network mumbai --rewardaddress 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E --chainid 10106 --peeraddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc
```

Set the trusted remote... 
```shell
npx hardhat onft721SetTrustedRemote --network fuji --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --peeraddress 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E --destinationchainid 10109
```

```shell
npx hardhat onft721SetTrustedRemote --network mumbai --rewardaddress 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E --peeraddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --destinationchainid 10106
```

Set the minimum gas to call the function on the receiving contract...
```shell
npx hardhat onft721SetMinDstGas --network fuji --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --destinationchainid 10109 --packagetype 1 --mingas 100000  
```

Cross chain call! 
```shell
npx hardhat onft721CrossChain --network fuji --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc --from 0xD81c446e32EBDE0f0F87254d900C2e15c9720b9D --to 0x53901c30c84C2cD3dE5Ca02ed1860CeB3a9A3776 --tokenid 0 --destinationchainid 10109 --gas 500000
```

Check that its burnt on fuji...

```shell
npx hardhat onft721OwnerOf --network fuji --tokenid 0 --rewardaddress 0xbA200DFa5EBe41A2f1Cf625FBdfC31004Bb04cDc  
```

Check that its minted on mumbai
```shell
npx hardhat onft721OwnerOf --network mumbai --tokenid 0 --rewardaddress 0xdD81174091c00A08c9c3eF2E2C3Cc29C5d38941E 
```