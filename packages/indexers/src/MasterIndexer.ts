import {
  IBigNumberUtils,
  IBigNumberUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  ChainTransaction,
  compareComponentStatus,
  EChain,
  EChainTechnology,
  EComponentStatus,
  EVMAccountAddress,
  EVMContractAddress,
  getChainInfoByChain,
  MethodSupportError,
  PersistenceError,
  SolanaAccountAddress,
  TokenAddress,
  TokenBalance,
  UnixTimestamp,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerContextProvider,
  IIndexerContextProviderType,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IMasterIndexer,
  IEVMIndexer,
  IAlchemyIndexerType,
  IAnkrIndexerType,
  ICovalentEVMTransactionRepositoryType,
  IEtherscanIndexerType,
  IMoralisEVMPortfolioRepositoryType,
  IOklinkIndexerType,
  IPoapRepositoryType,
  INftScanEVMPortfolioRepositoryType,
  IPolygonIndexerType,
  ISimulatorEVMTransactionRepositoryType,
  ISolanaIndexerType,
  ISolanaIndexer,
} from "@indexers/interfaces/index.js";

enum EIndexerMethod {
  Balances = "Balances",
  Transactions = "Transactions",
  NFTs = "NFTs",
}

@injectable()
export class MasterIndexer implements IMasterIndexer {
  protected evmIndexerWeights = [
    this.ankr,
    this.alchemy,
    this.etherscan,
    this.nftscan,
    this.poapRepo,
    this.sim,
    // TODO- enable these indexers as well
    // this.moralis,
    // this.oklink,
    // this.poapRepo,
    // this.matic,
  ];

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected config: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected indexerContext: IIndexerContextProvider,
    @inject(IAlchemyIndexerType) protected alchemy: IEVMIndexer,
    @inject(IAnkrIndexerType) protected ankr: IEVMIndexer,
    @inject(ICovalentEVMTransactionRepositoryType)
    protected covalent: IEVMIndexer,
    @inject(IEtherscanIndexerType) protected etherscan: IEVMIndexer,
    @inject(IMoralisEVMPortfolioRepositoryType) protected moralis: IEVMIndexer,
    @inject(INftScanEVMPortfolioRepositoryType) protected nftscan: IEVMIndexer,
    @inject(IOklinkIndexerType) protected oklink: IEVMIndexer,
    @inject(IPoapRepositoryType) protected poapRepo: IEVMIndexer,
    @inject(IPolygonIndexerType) protected matic: IEVMIndexer,
    @inject(ISimulatorEVMTransactionRepositoryType) protected sim: IEVMIndexer,
    @inject(ISolanaIndexerType) protected sol: ISolanaIndexer,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IBigNumberUtilsType) protected bigNumberUtils: IBigNumberUtils,
  ) {}

  // call this from elsewhere
  public initialize(): ResultAsync<void, AjaxError> {
    return ResultUtils.combine([
      this.alchemy.initialize(),
      this.ankr.initialize(),
      this.covalent.initialize(),
      this.etherscan.initialize(),
      this.matic.initialize(),
      this.moralis.initialize(),
      this.nftscan.initialize(),
      this.oklink.initialize(),
      this.poapRepo.initialize(),
      this.sim.initialize(),
      this.sol.initialize(),
    ])
      .andThen(() => {
        return this.getSupportedChains();
      })
      .map((supportedChains) => {
        this.logUtils.log(
          `Initialized indexers. Supported chains: ${supportedChains}`,
        );
      });
  }

  public getSupportedChains(): ResultAsync<EChain[], never> {
    return this.getHealthStatuses().map((healthStatuses) => {
      const activeChains = new Array<EChain>();
      healthStatuses.forEach((componentStatus, chain) => {
        if (
          componentStatus == EComponentStatus.Available ||
          componentStatus == EComponentStatus.InUse
        ) {
          activeChains.push(chain);
        }
      });
      return activeChains;
    });
  }

  public getLatestBalances(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    const chainInfo = getChainInfoByChain(chain);
    if (chainInfo.chainTechnology == EChainTechnology.Solana) {
      return this.sol
        .getBalancesForAccount(chain, SolanaAccountAddress(accountAddress))
        .orElse((e) => {
          this.logUtils.log(
            "Error fetching balances from solana indexer",
            chain,
            accountAddress,
            e,
          );
          return okAsync([]);
        })
        .map((tokenBalances) => {
          return tokenBalances.map((tokenBalance) => {
            if (!this.bigNumberUtils.validateBNS(tokenBalance.balance)) {
              tokenBalance.balance = BigNumberString("0");
            }

            return tokenBalance;
          });
        });
    }

    const indexer = this.getPreferredEVMIndexer(chain, EIndexerMethod.Balances);

    if (indexer == undefined) {
      return okAsync([]);
    }

    return indexer
      .getBalancesForAccount(chain, EVMAccountAddress(accountAddress))
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching balances from " + indexer.name() + " indexer",
          chain,
          accountAddress,
          e,
        );
        return okAsync([]);
      })
      .map((tokenBalances) => {
        // Apprently the tokenBalance.balance can return as in invalid
        // BigNumber (blank or null), so we'll just correct any possible issue
        // here.
        return tokenBalances.map((tokenBalance) => {
          if (!this.bigNumberUtils.validateBNS(tokenBalance.balance)) {
            tokenBalance.balance = BigNumberString("0");
          }
          return tokenBalance;
        });
      });
  }

  public getLatestNFTs(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
  > {
    const chainInfo = getChainInfoByChain(chain);
    if (chainInfo.chainTechnology == EChainTechnology.Solana) {
      return this.sol.getTokensForAccount(
        chain,
        SolanaAccountAddress(accountAddress),
      );
    }

    const indexer = this.getPreferredEVMIndexer(chain, EIndexerMethod.NFTs);

    if (indexer == null) {
      return okAsync([]);
    }

    return indexer
      .getTokensForAccount(chain, EVMAccountAddress(accountAddress))
      .map((tokens) => {
        return tokens;
      })
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching nfts from " + indexer.name() + " indexer",
          chain,
          accountAddress,
          e,
        );
        return okAsync([]);
      })
      .map((nfts) => {
        // Apprently the nft.amount can return as in invalid
        // BigNumber (blank or null), so we'll just correct any possible issue
        // here.
        return nfts.map((nft) => {
          if (!this.bigNumberUtils.validateBNS(nft.amount)) {
            nft.amount = BigNumberString("0");
          }
          return nft;
        });
      });
  }

  public getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chain: EChain,
  ): ResultAsync<
    ChainTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    const chainInfo = getChainInfoByChain(chain);
    if (chainInfo.chainTechnology == EChainTechnology.Solana) {
      return this.sol.getSolanaTransactions(
        chain,
        SolanaAccountAddress(accountAddress),
        new Date(timestamp * 1000),
      );
    }

    const indexer = this.getPreferredEVMIndexer(
      chain,
      EIndexerMethod.Transactions,
    );

    if (indexer == null) {
      return okAsync([]);
    }

    return indexer
      .getEVMTransactions(
        chain,
        EVMAccountAddress(accountAddress),
        new Date(timestamp * 1000),
      )
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching transactions from " + indexer.name() + " indexer",
          chain,
          accountAddress,
          e,
        );
        return okAsync([]);
      });
  }

  protected getPreferredEVMIndexer(
    chain: EChain,
    indexerMethod: EIndexerMethod,
  ): IEVMIndexer | null {
    let preferredIndexer: IEVMIndexer | ISolanaIndexer | null = null;

    // Sanity check that this is an EVM chain
    const chainInfo = getChainInfoByChain(chain);
    if (chainInfo.chainTechnology != EChainTechnology.EVM) {
      this.logUtils.error(
        `Requested preferred EVM Indexer for non EVM chain ${chain}`,
      );
      return null;
    }

    // Go through the indexers by weight.
    for (const indexer of this.evmIndexerWeights) {
      // Check if the indexer is healthy and supports the operation
      const indexerSupportSummary = indexer.getSupportedChains().get(chain);

      // If the indexer doesn't support the chain, move on
      if (indexerSupportSummary == null) {
        continue;
      }

      // Check if the indexer supports the operation, skip it if it does not
      if (
        indexerMethod === EIndexerMethod.Balances &&
        !indexerSupportSummary.balances
      ) {
        continue;
      } else if (
        indexerMethod === EIndexerMethod.Transactions &&
        !indexerSupportSummary.transactions
      ) {
        continue;
      } else if (
        indexerMethod === EIndexerMethod.NFTs &&
        !indexerSupportSummary.nfts
      ) {
        continue;
      }

      // Get the health status
      const status = indexer.healthStatus().get(chain);
      if (status == null) {
        continue;
      }
      if (
        status !== EComponentStatus.Available &&
        status !== EComponentStatus.InUse
      ) {
        continue;
      }

      // Got this far, the indexer is the one we want!
      preferredIndexer = indexer;
      break;
    }

    if (preferredIndexer == null) {
      this.logUtils.log(
        `No healthy indexer found for chain ${chain}, for operation ${indexerMethod}`,
      );
    }
    return preferredIndexer;
  }

  static get nativeAddress(): TokenAddress {
    return EVMContractAddress("0x0");
  }

  /* Sets the health statuses of each provider */
  protected getHealthStatuses(): ResultAsync<
    Map<EChain, EComponentStatus>,
    never
  > {
    return this.indexerContext.getContext().map((context) => {
      const alchemyHealth = this.alchemy.healthStatus();
      const ankrHealth = this.ankr.healthStatus();
      const covalentHealth = this.covalent.healthStatus();
      const etherscanHealth = this.etherscan.healthStatus();
      const maticHealth = this.matic.healthStatus();
      const moralisHealth = this.moralis.healthStatus();
      const nftscanHealth = this.nftscan.healthStatus();
      const oklinkHealth = this.oklink.healthStatus();
      const poapHealth = this.poapRepo.healthStatus();
      const simHealth = this.sim.healthStatus();
      const solHealth = this.sol.healthStatus();

      const indexerStatuses = context.components;
      indexerStatuses.alchemyIndexer = alchemyHealth;
      indexerStatuses.etherscanIndexer = etherscanHealth;
      indexerStatuses.moralisIndexer = moralisHealth;
      indexerStatuses.nftScanIndexer = nftscanHealth;
      indexerStatuses.oklinkIndexer = oklinkHealth;

      // The status of each indexer is known, and the chains that those indexers support is known.
      // We need to consolidate the component status for each chain via a group-by.
      // For each chain, use the best status of any indexer as the overall status for the chain

      // Need to consolidate the maps of chain->EComponentStatus
      const chainStatuses = new Map<EChain, EComponentStatus>();

      [
        alchemyHealth,
        ankrHealth,
        covalentHealth,
        etherscanHealth,
        maticHealth,
        moralisHealth,
        nftscanHealth,
        oklinkHealth,
        poapHealth,
        simHealth,
        solHealth,
      ].reduce((baseHealthStatus, healthStatus) => {
        healthStatus.forEach((status, chain) => {
          const baseStatus = baseHealthStatus.get(chain);
          if (baseStatus == null) {
            baseHealthStatus.set(chain, status);
            return;
          }

          // Check if the status is better than the existing status
          // InUse > Available > TemporarilyDisabled > Disabled > Error > NoKeyProvided
          baseHealthStatus.set(
            chain,
            compareComponentStatus(baseStatus, status),
          );
        });
        return baseHealthStatus;
      }, chainStatuses);

      return chainStatuses;
    });
  }
}
