import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  BlockchainProviderError,
  BlockNumber,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  ConsentFactoryContractError,
  IPFSError,
  PersistenceError,
  UninitializedError,
  QueryFormatError,
  QueryExpiredError,
  EvaluationError,
  ServerRewardError,
  ParserError,
  MissingTokenConstructorError,
  DuplicateIdInSchema,
  EvalNotImplementedError,
  MissingASTError,
  MissingWalletDataTypeError,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
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
  IInvitationRepository,
  IInvitationRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
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
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(ISDQLQueryRepositoryType)
    protected sdqlQueryRepository: ISDQLQueryRepository,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
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
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | IPFSError
    | AjaxError
    | ConsentContractError
    | ConsentError
    | QueryFormatError
    | EvaluationError
    | QueryExpiredError
    | BlockchainCommonErrors
    | ServerRewardError
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
    | EvalNotImplementedError
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
    | IPFSError
    | AjaxError
    | ConsentContractError
    | ConsentError
    | QueryFormatError
    | EvaluationError
    | QueryExpiredError
    | BlockchainCommonErrors
    | ServerRewardError
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
    | EvalNotImplementedError
  > {
    return this.invitationRepo
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
              this.consentContractRepository.getQueryHorizon(
                consentContract.getContractAddress(),
              ),
            ])
              .andThen(([consentOwner, queryHorizon]) => {
                return ResultUtils.combine([
                  consentContract.getRequestForDataListByRequesterAddress(
                    consentOwner,
                    queryHorizon,
                    currentBlockNumber,
                  ),
                  this.sdqlQueryRepository.getQueryStatusByConsentContract(
                    consentContract.getContractAddress(),
                    queryHorizon,
                  ),
                ]);
              })
              .andThen(([requestForDataObjects, queryStatus]) => {
                // We need to filter out the requestForDataObjects- remove any that we
                // already have a QueryStatus for
                const newRequests = requestForDataObjects.filter((r4d) => {
                  // Check if there's a query status already
                  const existingQueryStatus = queryStatus.find((qs) => {
                    return qs.queryCID == r4d.requestedCID;
                  });
                  // If there's no existing query status, it's a new query
                  return existingQueryStatus == null;
                });

                if (newRequests.length > 0) {
                  this.logUtils.info("Received requests for data", newRequests);
                }

                // In the odd case that multiple events for the same CID was found, we need
                // to ditch the repeats
                // If we create a map by the IpfsCIDs, any repeats will be overwritten
                const filteredMap = new Map(
                  newRequests.map((r4d) => {
                    return [r4d.requestedCID, r4d];
                  }),
                );

                return ResultUtils.combine(
                  Array.from(filteredMap.values()).map(
                    (requestForDataObject) => {
                      return this.queryService.onQueryPosted(
                        requestForDataObject,
                      );
                    },
                  ),
                );
              });
          }),
        ).map((result) => {});
      });
  }
}
