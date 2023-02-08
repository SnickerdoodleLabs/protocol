# Indexers Package

The indexers package supports API calls necessary to compile the proper web response data needed for transaction indexing and Web3 data display.  Applying the chain configuration information found in the objects package, the indexers package utilizes this information to better display how this information is passed on.  This document highlights the steps the indexer package uses in order to keep the calls operation.  

Web3 indexing falls into two subgroups:
1. EVM compatible chains
2. Non-EVM chains

EVM compatible chains rely on their Etherscan variants to pull their correct information.  Currently supported chains can be found in the **chainConfig** constant found within the [chains.config.ts]("/packages/objects/src/configuration/chains.config.ts") file. Aside from their **name**, **chainId**, and their **nativeCurrency**, each include an explorerUrl and etherscanEndpointUrl which are used within their API calls.  The similar indexing found in each of the outputs allows these chains to be streamlined, with the only notable updates involving the **chainConfig** constant and minor syntax changes. Etherscan API calls are found at [EtherscanIndexer.ts](/packages/indexers/src/EtherscanIndexer.ts).

Every non-EVM supported chain variates drastically in its transaction indexing, thereby using benefiting from separate indexing files.  

Web3 APIs return three pertinent pieces of information: 
1. Account Balances: where the [DefaultAccountBalances.ts](/packages/indexers/src/DefaultAccountBalances.ts) implementation binds to the[IAccountBalances.ts](/packages/objects/src/interfaces/IAccountBalances.ts) interface. 
2. Account Indexing: where the [DefaultAccountIndexers.ts](/packages/indexers/src/DefaultAccountIndexers.ts) implementation binds to the[IAccountIndexingType.ts](/packages/objects/src/interfaces/IAccountIndexing.ts) interface. 
3. Account NFTs: where the [DefaultAccountNFTs.ts](/packages/indexers/src/DefaultAccountNFTs.ts) implementation binds to the[IAccountNFTsType.ts](/packages/objects/src/interfaces/IAccountNFTsType.ts) interface. 

Each subfield is necessary for storing and displaying information on both the Data Wallet and Insight Platform service. 

# Balances
Balances showcase a users history of fees and payments over the lifespan of the wallet.  The Data Wallet showcases a users native balance, the value compared to USD, and the native currency information.  Token information is often pulled from [CoinGeckoTokenPriceRepository.ts] (/packages/indexers/src/CoinGeckoTokenPriceRepository.ts). 

# Indexing
Indexing shows the history of account transactions over the lifespan of the wallet.  
Transactions include: 
    - buying or sending currency
    - purchasing non fungible tokens with your currency
    - gas payments
    - token drops
Transaction Indexing varies heavily per chain and is often the bottleneck for introducing a new chain into the ecosystem. Token types like ERC-20, ERC-721, and ERC-1155 exist for EVM chains.  On non-EVM chains, there are many variables that would require many established rules to filter the transactions. 
Sample indexing packages include:
- [PolygonIndexer.ts] (/packages/indexers/src/PolygonIndexer.ts)
- [SolanaIndexer.ts] (/packages/indexers/src/SolanaIndexer.ts)

# Non Fungible Tokens
Non Fungible Tokens are most easily found and displayed via Api calls from several hubs. 
These include:
- [MoralisEVMPortfolioRepository.ts] (/packages/indexers/src/MoralisEVMPortfolioRepository.ts)
- [NftScanEVMPortfolioRepository.ts] (/packages/indexers/src/NftScanEVMPortfolioRepository.ts)

# Involvement with the Persistence Layer
Persistence layer functions call the indexers packages to return correponding Web3 information.  Returned values are often cached within the Persistence Layer to reduce the frequency of calls.  More detail about the persistence layer's structure can be found at its appropriate [README.ts] (../persistence layer/README.md).