import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainProviderError,
  BlockNumber,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  ConsentFactoryContractError,
  EVMContractAddress,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IPFSError,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IBlockchainListener } from "@core/interfaces/api";
import {
  IMonitoringService,
  IMonitoringServiceType,
  IQueryService,
  IQueryServiceType,
} from "@core/interfaces/business";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
} from "@core/interfaces/data";
import { CoreConfig } from "@core/interfaces/objects";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

/**
 * This class is much simplified from before, and has only a single responsibility-
 * it must monitor all the opted-in consent contracts for requestForData events
 * on the control chain.
 */
@injectable()
export class BlockchainListener implements IBlockchainListener {
  constructor(
    @inject(IMonitoringServiceType)
    protected monitoringService: IMonitoringService,
    @inject(IQueryServiceType)
    protected queryService: IQueryService,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
  ) {}

  protected queryHorizonCache = new Map<
    EVMContractAddress,
    BlockNumber | null
  >();

  public initialize(): ResultAsync<
    void,
    BlockchainProviderError | PersistenceError | UninitializedError
  > {
    /**
     * The BlockchainListener needs to actually listen to ALL the chains we are monitoring;
     * this means we need to get ALL the providers and hook up listeners for all the accounts
     * in the wallet
     */
    this.logUtils.debug("Initializing Blockchain Listener");

    return ResultUtils.combine([this.configProvider.getConfig()]).map(
      ([config]) => {
        setInterval(() => {
          this.controlChainBlockMined(config).mapErr((e) => {
            console.error(e);
            return e;
          });
        }, config.controlChainInformation.averageBlockMiningTime);
      },
    );
  }

  protected controlChainBlockMined(
    config: CoreConfig,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractRepositoryError
    | IPFSError
    | AjaxError
    | ConsentContractError
    | ConsentError
    | PersistenceError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getLatestBlock(config.controlChainId),
      this.dataWalletPersistence.getLatestBlockNumber(),
    ]).andThen(([currentBlock, latestBlock]) => {
      const currentBlockNumber = BlockNumber(currentBlock.number);

      if (latestBlock < currentBlockNumber) {
        // If the latest known block is older than the current block, there are potentially events
        return this.listenForConsentContractsEvents(
          latestBlock,
          currentBlockNumber,
        ).andThen(() => {
          return this.dataWalletPersistence.setLatestBlockNumber(
            currentBlockNumber,
          );
        });
      }

      return okAsync(undefined);
    });
  }

  protected listenForConsentContractsEvents(
    firstBlockNumber: BlockNumber,
    lastBlockNumber: BlockNumber,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractRepositoryError
    | IPFSError
    | AjaxError
    | ConsentContractError
    | ConsentError
  > {
    return this.consentContractRepository
      .getConsentContracts()
      .andThen((consentContractsMap) => {
        return ResultUtils.combine(
          Array.from(consentContractsMap.values()).map((consentContract) => {
            // Only consent owners can request data
            return ResultUtils.combine([
              consentContract.getConsentOwner(),
              this.getQueryHorizon(consentContract),
            ])
              .andThen(([consentOwner, queryHorizon]) => {
                // Start at the queryHorizon or the firstBlockNumber, whichever is later
                const startBlock =
                  queryHorizon > firstBlockNumber
                    ? queryHorizon
                    : firstBlockNumber;

                return consentContract.getRequestForDataListByRequesterAddress(
                  consentOwner,
                  startBlock,
                  lastBlockNumber,
                );
              })
              .andThen((requestForDataObjects) => {
                return ResultUtils.combine(
                  requestForDataObjects.map((requestForDataObject) => {
                    return this.queryService.onQueryPosted(
                      requestForDataObject.consentContractAddress,
                      requestForDataObject.requestedCID,
                    );
                  }),
                );
              });
          }),
        ).map((result) => {});
      });
  }

  protected getQueryHorizon(
    consentContract: IConsentContract,
  ): ResultAsync<BlockNumber, ConsentContractError> {
    // Check if the query horizon is in the cache
    const cachedQueryHorizon = this.queryHorizonCache.get(
      consentContract.getContractAddress(),
    );

    if (cachedQueryHorizon != null) {
      return okAsync(cachedQueryHorizon);
    }

    return consentContract.getQueryHorizon().map((queryHorizon) => {
      this.queryHorizonCache.set(
        consentContract.getContractAddress(),
        queryHorizon,
      );

      return queryHorizon;
    });
  }
}
