import { ILogUtilsType, ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  SiteVisit,
  IAccountIndexing,
  IAccountIndexingType,
  EVMAccountAddress,
  ChainId,
  AccountIndexingError,
  EIndexer,
  UnixTimestamp,
  AjaxError,
  PersistenceError,
  IAccountBalancesType,
  IAccountBalances,
  IAccountNFTsType,
  IAccountNFTs,
  AccountAddress,
  ChainTransaction,
  SolanaAccountAddress,
  isAccountValidForChain,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IMonitoringService } from "@core/interfaces/business/index.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IConfigProvider,
  IConfigProviderType,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class MonitoringService implements IMonitoringService {
  public constructor(
    @inject(IAccountIndexingType) protected accountIndexing: IAccountIndexing,
    @inject(IAccountBalancesType) protected accountBalances: IAccountBalances,
    @inject(IAccountNFTsType) protected accountNFTs: IAccountNFTs,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public pollTransactions(): ResultAsync<
    void,
    PersistenceError | AccountIndexingError | AjaxError
  > {
    // Grab the linked accounts and the config
    return ResultUtils.combine([
      this.persistence.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([linkedAccounts, config]) => {
        // Loop over all the linked accounts in the data wallet, and get the last transaction for each supported chain
        // config.chainInformation is the list of supported chains,
        return ResultUtils.combine(
          linkedAccounts.map((linkedAccount) => {
            return ResultUtils.combine(
              config.supportedChains.map((chainId) => {
                if (!isAccountValidForChain(chainId, linkedAccount)) {
                  return okAsync([]);
                }

                return this.persistence
                  .getLatestTransactionForAccount(
                    chainId,
                    linkedAccount.sourceAccountAddress,
                  )
                  .andThen((tx) => {
                    // TODO: Determine cold start timestamp
                    let startTime = UnixTimestamp(0);
                    if (tx != null && tx.timestamp != null) {
                      startTime = tx.timestamp;
                    }

                    return this.getLatestTransactions(
                      linkedAccount.sourceAccountAddress,
                      startTime,
                      chainId,
                    ).orElse((e) => {
                      this.logUtils.error(
                        "error fetching transactions",
                        chainId,
                        linkedAccount.sourceAccountAddress,
                        e,
                      );
                      return okAsync([]);
                    });
                  });
              }),
            );
          }),
        );
      })
      .andThen((transactionsArr) => {
        const transactions = transactionsArr.flat(2);
        return this.persistence.addTransactions(transactions); // let's not call if empty?
      });
  }

  public siteVisited(
    siteVisit: SiteVisit,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.addSiteVisits([siteVisit]);
  }

  protected getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<ChainTransaction[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountIndexing.getEVMTransactionRepository(),
      this.accountIndexing.getSolanaTransactionRepository(),
      this.accountIndexing.getSimulatorEVMTransactionRepository(),
      this.accountIndexing.getEthereumTransactionRepository(),
      this.accountIndexing.getPolygonTransactionRepository(),
    ]).andThen(
      ([config, evmRepo, solRepo, simulatorRepo, etherscanRepo, maticRepo]) => {
        // Get the chain info for the transaction
        const chainInfo = config.chainInformation.get(chainId);
        if (chainInfo == null) {
          this.logUtils.error(`No available chain info for chain ${chainId}`);
          return okAsync([]);
        }

        switch (chainInfo.indexer) {
          case EIndexer.EVM:
            return evmRepo.getEVMTransactions(
              chainId,
              accountAddress as EVMAccountAddress,
              new Date(timestamp * 1000),
            );
          case EIndexer.Simulator:
            return simulatorRepo.getEVMTransactions(
              chainId,
              accountAddress as EVMAccountAddress,
              new Date(timestamp * 1000),
            );
          case EIndexer.Solana:
            return solRepo.getSolanaTransactions(
              chainId,
              accountAddress as SolanaAccountAddress,
              new Date(timestamp * 1000),
            );
          case EIndexer.Ethereum:
            return etherscanRepo.getEVMTransactions(
              chainId,
              accountAddress as EVMAccountAddress,
              new Date(timestamp * 1000),
            );
          case EIndexer.Polygon:
            return maticRepo.getEVMTransactions(
              chainId,
              accountAddress as EVMAccountAddress,
              new Date(timestamp * 1000),
            );
          case EIndexer.Gnosis:
            return okAsync([]);
          case EIndexer.Binance:
            return okAsync([]);
          case EIndexer.Moonbeam:
            return okAsync([]);
          default:
            this.logUtils.error(
              `No available indexer repository for chain ${chainId}`,
            );
            return okAsync([]);
        }
      },
    );
  }

  public pollBackups(): ResultAsync<void, PersistenceError> {
    return this.persistence.pollBackups();
  }
}
