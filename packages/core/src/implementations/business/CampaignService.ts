import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentFactoryContractError,
  EvaluationError,
  EVMContractAddress,
  IpfsCID,
  PossibleReward,
  RequestForData,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICampaignService } from "@core/interfaces/business/index.js";
import {
  IQueryParsingEngine,
  IQueryParsingEngineType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class CampaignService implements ICampaignService {
  public constructor(
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(IQueryParsingEngineType)
    protected queryParsingEngine: IQueryParsingEngine,
    @inject(ISDQLQueryRepositoryType)
    protected sdqlQueryRepo: ISDQLQueryRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs: number,
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, EvaluationError> {
    if (!contractAddresses) {
      return okAsync(new Map());
    }
    return ResultUtils.combine(
      contractAddresses.map((address) => {
        return this._getPublishedQueries(address).andThen((queries) => {
          return this._getPossibleRewards(queries, timeoutMs).map(
            (rewards) =>
              [address, rewards] as [EVMContractAddress, PossibleReward[]],
          );
        });
      }),
    ).map(this._filterEmptyRewards);
  }

  private _filterEmptyRewards(
    contractToRewardsTuples: [EVMContractAddress, PossibleReward[]][],
  ): Map<EVMContractAddress, PossibleReward[]> {
    return new Map(
      contractToRewardsTuples.filter(
        (tuple) => tuple.length == 2 && tuple[1].length > 0,
      ),
    );
  }

  private _getPublishedQueries(
    contractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
  > {
    return this._getConsentContract(contractAddress)
      .andThen((contract) => {
        return this._getPublishedQueriesPerContract(contract);
      })
      .orElse((e) => {
        this.logUtils.warning(
          `No contract could be retrieved with address ${contractAddress}. ` +
            `Returning [] as published queries. Error message: ${e.message}`,
        );
        return okAsync([]);
      });
  }

  private _getConsentContract(
    contractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentContract,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
  > {
    return this.consentContractRepository
      .getConsentContracts([contractAddress])
      .map((consentContractsMap) => consentContractsMap.get(contractAddress)!);
  }

  private _getPublishedQueriesPerContract(
    consentContract: IConsentContract,
  ): ResultAsync<IpfsCID[], ConsentContractError> {
    return this._getRequestForDataList(consentContract).map((r4dList) =>
      r4dList.map((r4d) => r4d.requestedCID),
    );
  }

  private _getRequestForDataList(
    consentContract: IConsentContract,
  ): ResultAsync<RequestForData[], ConsentContractError> {
    return consentContract.getConsentOwner().andThen((consentOwner) => {
      return consentContract.getRequestForDataListByRequesterAddress(
        consentOwner,
      );
    });
  }

  private _getPossibleRewards(
    queryCids: IpfsCID[],
    timeoutMs: number,
  ): ResultAsync<PossibleReward[], EvaluationError | AjaxError> {
    if (!queryCids || queryCids.length == 0) {
      return okAsync([]);
    }
    return ResultUtils.combine(
      queryCids.map((cid) => this._getPossibleRewardsPerQuery(cid, timeoutMs)),
    ).map((rewardsOfAllQueries) =>
      Array.from(new Set(rewardsOfAllQueries.flat())),
    );
  }

  private _getPossibleRewardsPerQuery(
    queryCid: IpfsCID,
    timeoutMs: number,
  ): ResultAsync<PossibleReward[], AjaxError | EvaluationError> {
    return this.sdqlQueryRepo
      .getByCID(queryCid, timeoutMs)
      .andThen((sdqlQuery) => {
        if (sdqlQuery == null) {
          return okAsync([]);
        }
        return this.queryParsingEngine.getPossibleRewards(sdqlQuery);
      });
  }
}
