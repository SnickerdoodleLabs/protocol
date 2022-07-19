# Snickerdoodle Protocol Indexers Package Source Directory

## Package Contents

- [CovalentEVMTransactionRepository.ts](/packages/indexers/src/CovalentEVMTransactionRepository.ts): Object responsible for construction, submission, and response processing of queries from the [Covalent API](https://www.covalenthq.com/docs/api/#/0/0/USD/1) for EVM chains. Implementation of [IEVMTransactionRepository](/packages/objects/src/interfaces/chains/IEVMTransactionRepository.ts).

- [DefaultAccountIndexers.ts](/packages/indexers/src/DefaultAccountIndexers.ts): Object resposible for holding indexers of different kinds. Currently only EVM transactions from Covalent are supported, but this could be extended to match indexer queries to the correct data sources. 

- [IIndexerConfig.ts](/packages/indexers/src/IIndexerConfig.ts): Defines the schema of the indexer config for consumption by the indexer objects.

- [IIndexerConfigProvider.ts](/packages/indexers/src/IIndexerConfigProvider.ts): Provider interface for the indexer config. 

- [SimulatorEVMTransactionRepository.ts](/packages/indexers/src/SimulatorEVMTransactionRepository.ts): [IEVMTransactionRepository](/packages/objects/src/interfaces/chains/IEVMTransactionRepository.ts) implementation for use by the [Test Harness](/packages/test-harness/README.md).

## Summary
Source files for the indexers package. Here we define the implementations of clients for fetching blockchain data.