import { ILogUtilsType, ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  SiteVisit,
  IAccountIndexing,
  IAccountIndexingType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  EVMAccountAddress,
  ChainId,
  IAvalancheEVMTransactionRepository,
  IAvalancheEVMTransactionRepositoryType,
  IEthereumTransactionRepository,
  IEthereumTransactionRepositoryType,
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

const ETHEREUM_CHAIN_ID: ChainId = 1;
const AVALANCHE_CHAIN_ID: ChainId = 43114;

@injectable()
export class MonitoringService implements IMonitoringService {
  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IAccountIndexingType) protected accountIndexing: IAccountIndexing,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public pollTransactions(): ResultAsync<void, never> {
    // Grab the linked accounts and the config
    ResultUtils.combine([
      this.persistence.getAccounts(),
      this.configProvider.getConfig(),
      this.accountIndexing.getEthereumEVMTransactionRepository(),
      this.accountIndexing.getAvalancheEVMTransactionRepository(),
    ]).andThen(([accountAddresses, config, ethRepo, avalancheRepo]) => {
      // Loop over all the linked accounts in the data wallet, and get the last transaction for each supported chain
      // config.chainInformation is the list of supported chains,
      accountAddresses
        .map((accountAddress) => {
          Array.from(config.chainInformation.keys()).map((chainId) =>
            this.persistence.getLatestTransactionForAccount(
              chainId,
              accountAddress,
            ),
          );
        })
        .andThen((tipTransactions) => {
          return tipTransactions.map((tx) => {
            if (tx.chainId == config.ethChainId) {
              return ethRepo.getEVMTransactions(accountAddresses, tx.timestamp);
            }
            if (tx.chainId == config.avaxChainId) {
              return avalancheRepo.getEVMTransactions(
                accountAddresses,
                tx.timestamp,
              );
            }

            this.logUtils.error(
              `No available indexer repository for chain ${tx.chainId}`,
            );
            return [];
          });
        })
        .map((transactions) => {
          return this.persistence.addEVMTransactions(transactions);
        });
    });
  }

  public siteVisited(SiteVisit: SiteVisit): ResultAsync<void, never> {
    throw new Error("Method not implemented.");
  }
}
