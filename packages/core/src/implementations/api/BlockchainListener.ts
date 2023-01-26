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
  IPFSError,
  PersistenceError,
  UninitializedError,
  QueryFormatError,
  QueryExpiredError,
  EvaluationError,
  IpfsCID,
  RequestForData,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IBlockchainListener } from "@core/interfaces/api/index.js";
import {
  IMonitoringService,
  IMonitoringServiceType,
  IQueryService,
  IQueryServiceType,
} from "@core/interfaces/business/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";
import { CoreConfig } from "@core/interfaces/objects/index.js";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

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

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map(([config, context]) => {
      // Start polling
      setInterval(() => {
        this.controlChainBlockMined(config).mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
      }, config.requestForDataCheckingFrequency);

      // Subscribe to the opt-in event, and immediately do a poll
      context.publicEvents.onCohortJoined.subscribe(() => {
        this.controlChainBlockMined(config).mapErr((e) => {
          this.logUtils.error(e);
          return e;
        });
      });
    });
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
    | QueryFormatError
    | QueryExpiredError
    | EvaluationError
  > {
    return this.blockchainProvider
      .getLatestBlock(config.controlChainId)
      .andThen((currentBlock) => {
        const currentBlockNumber = BlockNumber(currentBlock.number);

        return this.listenForConsentContractsEvents(currentBlockNumber);
      });
  }

  protected listenForConsentContractsEvents(
    currentBlockNumber: BlockNumber,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractRepositoryError
    | IPFSError
    | AjaxError
    | ConsentContractError
    | ConsentError
    | QueryFormatError
    | EvaluationError
    | QueryExpiredError
  > {
    return this.dataWalletPersistence
      .getAcceptedInvitations()
      .andThen((optIns) => {
        return this.consentContractRepository.getConsentContracts(
          optIns.map((oii) => oii.consentContractAddress),
        );
      })
      .andThen((consentContractsMap) => {
        return ResultUtils.combine(
          Array.from(consentContractsMap.values()).map((consentContract) => {
            // Only consent owners can request data
            return ResultUtils.combine([
              consentContract.getConsentOwner(),
              this.getQueryHorizon(consentContract),
              this.dataWalletPersistence.getLatestBlockNumber(
                consentContract.getContractAddress(),
              ),
            ])
              .andThen(([consentOwner, queryHorizon, latestBlockNumber]) => {
                // Start at the queryHorizon or the firstBlockNumber, whichever is later
                const startBlock =
                  queryHorizon > latestBlockNumber
                    ? queryHorizon
                    : latestBlockNumber;

                // Only need to do the query if the calculated start block is less than
                // the current block on the chain
                if (startBlock >= currentBlockNumber) {
                  return okAsync([]);
                }

                return consentContract
                  .getRequestForDataListByRequesterAddress(
                    consentOwner,
                    startBlock,
                    currentBlockNumber,
                  )
                  .andThen((requestForDataObjects) => {
                    return this.dataWalletPersistence
                      .setLatestBlockNumber(
                        consentContract.getContractAddress(),
                        currentBlockNumber,
                      )
                      .map(() => {
                        return requestForDataObjects;
                      });
                  });
              })
              .andThen((requestForDataObjects) => {
                if (requestForDataObjects.length > 0) {
                  this.logUtils.info(
                    "Received requests for data",
                    requestForDataObjects,
                  );
                }

                // In the odd case that multiple events for the same CID was found, we need
                // to ditch the repeats
                // If we create a map by the IpfsCIDs, any repeats will be overwritten
                const filteredMap = new Map(
                  requestForDataObjects.map((r4d) => {
                    return [r4d.requestedCID, r4d];
                  }),
                );

                return ResultUtils.combine(
                  Array.from(filteredMap.values()).map(
                    (requestForDataObject) => {
                      return this.queryService.onQueryPosted(
                        requestForDataObject.consentContractAddress,
                        requestForDataObject.requestedCID,
                      );
                    },
                  ),
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
