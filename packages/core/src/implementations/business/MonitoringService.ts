import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  DataWalletBackupID,
  DiscordError,
  IMasterIndexer,
  IMasterIndexerType,
  isAccountValidForChain,
  PersistenceError,
  SiteVisit,
  TwitterError,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IDiscordService,
  IDiscordServiceType,
  IMonitoringService,
  ITwitterService,
  ITwitterServiceType,
} from "@core/interfaces/business/index.js";
import {
  IBrowsingDataRepository,
  IBrowsingDataRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class MonitoringService implements IMonitoringService {
  public constructor(
    @inject(IMasterIndexerType)
    protected masterIndexer: IMasterIndexer,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
    @inject(ITransactionHistoryRepositoryType)
    protected transactionRepo: ITransactionHistoryRepository,
    @inject(IBrowsingDataRepositoryType)
    protected browsingDataRepo: IBrowsingDataRepository,
    @inject(IDiscordServiceType)
    protected discordService: IDiscordService,
    @inject(ITwitterServiceType)
    protected twitterService: ITwitterService,
  ) {}

  public pollTransactions(): ResultAsync<
    void,
    PersistenceError | AccountIndexingError | AjaxError
  > {
    // Grab the linked accounts and the config
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
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

                return this.transactionRepo
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

                    return this.masterIndexer
                      .getLatestTransactions(
                        linkedAccount.sourceAccountAddress,
                        startTime,
                        chainId,
                      )
                      .orElse((e) => {
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
        return this.transactionRepo.addTransactions(transactions);
      });
  }

  public siteVisited(
    siteVisit: SiteVisit,
  ): ResultAsync<void, PersistenceError> {
    return this.browsingDataRepo.addSiteVisits([siteVisit]);
  }

  public pollBackups(): ResultAsync<void, PersistenceError> {
    return this.persistence.pollBackups();
  }

  public pollDiscord(): ResultAsync<void, PersistenceError | DiscordError> {
    return this.discordService.poll();
  }

  public pollTwitter(): ResultAsync<void, PersistenceError | TwitterError> {
    return this.twitterService.poll();
  }

  public postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError> {
    return this.persistence.postBackups();
  }
}
