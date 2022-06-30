![Snickerdoodle](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Avalanche Fuji Subnet

This subdirectory contains the genesis file and documentation for the Snickerdoodle 
[Fuji](https://docs.avax.network/quickstart/fuji-workflow) Subnet. 

## Fuji Subnet Settings

The Fuji genesis file, [`snickerdoodle_local_genesis.json`](/packages/subnets/fuji/snickerdoodle_local_genesis.json), defines the parameters of the Snickerdoodle Fuji Subnet.

- Subnet Name: `Snickerdoodle`
- [chainId](https://chainlist.org/): `36`
- Total token amount: `13,500,000,000 DOODLE` 
- Genesis Airdrop Account: `0x73c6ed3a092be873ae1721bf169cd6b4f4832cb2` (PK is in LastPass)
- VMID: `sqYBDmwoQ4Pjb2aaTMfS4kLiZ4zpNgQmziEsuTSLbmvW7sNgh` (`subnet-cli create VMID snickerdoodle_fuji`)


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

First, make sure you have the [Subnet CLI](https://github.com/ava-labs/subnet-cli) installed (this can be on *any* machine):

```shell
curl -L https://github.com/ava-labs/subnet-cli/releases/download/v0.0.2/subnet-cli_0.0.2_linux_amd64.tar.gz | tar zx
```

Then [generate a private key](https://docs.avax.network/subnets/create-a-fuji-subnet#private-key) for your Fuji validator:

```shell
subnet-cli create key
```

This will generate a file called `subnet-cli.pk`. Import this key into the [Avalanche Web Wallet](https://wallet.avax.network/). Be 
sure to switch the wallet over to the Fuji testnet. You will need a non-zero balance on the P-Chain to create your subnet. Transfer
Fuji AVAX into the C-Chain account, click on the `Cross Chain` tab on the left side of the application, and transfer at least 1 AVAX
from the C Chain into the P Chain account.  

### 3. Fund your Fuji Validator Account

Use the [public faucet](https://faucet.avax.network/) to fund your validator key you generated in the previous step on the C-Chain. 
Next, click on the Cross Chain tab on the left hand side of the Web Wallet application and bridge your funds from the C-Chain to the 
P-Chain by . 

### 4. Get a EVM Subnet Binary

```shell
curl -L https://github.com/ava-labs/subnet-evm/releases/download/v0.2.4/subnet-evm_0.2.4_linux_amd64.tar.gz | tar zx
```