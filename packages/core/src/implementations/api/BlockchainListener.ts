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
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
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
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
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
    return this.accountRepo
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
              this.getQueryHorizon(consentContract),
              this.accountRepo.getLatestBlockNumber(
                consentContract.getContractAddress(),
              ),
            ])
              .andThen(([queryHorizon, latestBlockNumber]) => {
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

                return this.getRequestForDataList(
                  consentContract,
                  startBlock,
                  currentBlockNumber,
                ).andThen((requestForDataObjects) => {
                  return this.accountRepo
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

  public getAllQueryCIDs(
    contractAddresses: EVMContractAddress[],
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<
    Map<EVMContractAddress, IpfsCID[]>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
  > {
    return this.consentContractRepository
      .getConsentContracts(contractAddresses)
      .andThen((consentContractsMap) => {
        return ResultUtils.combine(
          Array.from(consentContractsMap.values()).map((consentContract) => {
            return this.getPublishedQueryCIDs(
              consentContract,
              fromBlock,
              toBlock,
            ).map(
              (queryCidList) =>
                [consentContract.getContractAddress(), queryCidList] as [
                  EVMContractAddress,
                  IpfsCID[],
                ],
            );
          }),
        ).map(
          (contractsToCidLists) =>
            new Map<EVMContractAddress, IpfsCID[]>(contractsToCidLists),
        );
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

  protected getPublishedQueryCIDs(
    consentContract: IConsentContract,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<IpfsCID[], ConsentContractError> {
    return this.getRequestForDataList(consentContract, fromBlock, toBlock).map(
      (r4dList) => r4dList.map((r4d) => r4d.requestedCID),
    );
  }

  protected getRequestForDataList(
    consentContract: IConsentContract,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<RequestForData[], ConsentContractError> {
    return consentContract.getConsentOwner().andThen((consentOwner) => {
      return consentContract.getRequestForDataListByRequesterAddress(
        consentOwner,
        fromBlock,
        toBlock,
      );
    });
  }
}
