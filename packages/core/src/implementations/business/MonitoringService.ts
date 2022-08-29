import { ILogUtilsType, ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  SiteVisit,
  IAccountIndexing,
  IAccountIndexingType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  EVMAccountAddress,
  ChainId,
  AccountIndexingError,
  EVMTransaction,
  EIndexer,
  UnixTimestamp,
  AjaxError,
  PersistenceError,
  IAccountBalancesType,
  IAccountBalances,
  IEVMBalance,
  AccountBalanceError,
  AccountNFTError,
  IEVMNFT,
  IAccountNFTsType,
  IAccountNFTs,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IMonitoringService } from "@core/interfaces/business";
import {
  IContextProvider,
  IConfigProvider,
  IConfigProviderType,
  IContextProviderType,
} from "@core/interfaces/utilities";

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
      .andThen(([accountAddresses, config]) => {
        // Loop over all the linked accounts in the data wallet, and get the last transaction for each supported chain
        // config.chainInformation is the list of supported chains,
        return ResultUtils.combine(
          accountAddresses.map((accountAddress) => {
            return ResultUtils.combine(
              config.supportedChains.map((chainId) => {
                return this.persistence
                  .getLatestTransactionForAccount(chainId, accountAddress)
                  .andThen((tx) => {

                    if (tx !== null) {
                      console.log("latest tx", tx);

                    }


                    // TODO: Determine cold start timestamp
                    let startTime = UnixTimestamp(0);
                    if (tx != null && tx.timestamp != null) {
                      startTime = tx.timestamp;
                    }

                    return this.getLatestTransactions(
                      accountAddress,
                      startTime,
                      chainId,
                    );
                  });
              }),
            );
          }),
        );
      })
      .andThen((transactionsArr) => {
        const transactions = transactionsArr.flat(2);
        return this.persistence.addEVMTransactions(transactions);
      });
  }

  public siteVisited(SiteVisit: SiteVisit): ResultAsync<void, never> {
    throw new Error("Method not implemented.");
  }

  protected getLatestTransactions(
    accountAddress: EVMAccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountIndexing.getEVMTransactionRepository(),
      this.accountIndexing.getSimulatorEVMTransactionRepository(),
    ]).andThen(([config, evmRepo, simulatorRepo]) => {
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
            accountAddress,
            new Date(timestamp * 1000),
          );
        case EIndexer.Simulator:
          return simulatorRepo.getEVMTransactions(
            chainId,
            accountAddress,
            new Date(timestamp * 1000),
          );
        default:
          this.logUtils.error(
            `No available indexer repository for chain ${chainId}`,
          );
          return okAsync([]);
      }
    });
  }
}
