![Snickerdoodle](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Avalanche Fuji Subnet

This subdirectory contains the genesis file and documentation for the Snickerdoodle 
[Fuji](https://docs.avax.network/quickstart/fuji-workflow) Subnet. 

## Fuji Subnet Settings

The Fuji genesis file, [`snickerdoodle_genesis.json`](/packages/subnets/fuji/snickerdoodle_genesis.json), defines the parameters of the Snickerdoodle Fuji Subnet.

- Subnet Name: `Snickerdoodle`
- [chainId](https://chainlist.org/): `36`
- Total token amount: `13,500,000,000 DOODLE` 
- Genesis Airdrop Account: `TBD` (this is the first test account in Hardhat)


## TODO: Steps for Adding a Validator to the Snickerdoodle Fuji Subnet

### 1. Sync a Fuji Node

Use the Snickerdoodle Avalanche Node Stack to synchronize a Fuji node to the public testnet. Use the following command
to determine when the node is bootstrapped:

```shell
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.isBootstrapped",
    "params": {
        "chain":"X"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

### 2. Generate a Fuji Validator Key

First, make sure you have the [Subnet CLI](https://github.com/ava-labs/subnet-cli) installed:

```shell
curl -L https://github.com/ava-labs/subnet-cli/releases/download/v0.0.2/subnet-cli_0.0.2_linux_amd64.tar.gz | tar zx
```

Then [generate a private key](https://docs.avax.network/subnets/create-a-fuji-subnet#private-key) for your Fuji validator:

```shell
subnet-cli create key
```

Import this key into the [Avalanche Web Wallet](https://wallet.avax.network/) to view your balances across X, P, and C Chains. 
You will need a non-zero balance on the P-Chain to create your subnet. 

### 3. Fund your Fuji Validator Account

Use the [public faucet](https://faucet.avax.network/) to fund your validator key you generated in the previous step on the C-Chain. 
Then bridge your funds from the [C-Chain to the P-Chain](https://docs.avax.network/quickstart/cross-chain-transfers#example-code).