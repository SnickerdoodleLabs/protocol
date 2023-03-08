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
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainProviderError,
  BlockNumber,
  ConsentContractError,
  ConsentFactoryContractError,
  EvaluationError,
  EVMContractAddress,
  IpfsCID,
  PossibleReward,
  RequestForData,
  SDQLQuery,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class CampaignService implements ICampaignService {
  QUERY_GET_TIMEOUT = 3000;

  public constructor(
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(IQueryParsingEngineType)
    protected queryParsingEngine: IQueryParsingEngine,
    @inject(ISDQLQueryRepositoryType)
    protected sdqlQueryRepo: ISDQLQueryRepository,
  ) {}

  public getPossibleRewards(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, EvaluationError> {
    return this._getPublishedQueries(contractAddresses).andThen(
      (contractsToCids) => {
        return this._getPossibleRewards(contractsToCids);
      },
    );
  }

  private _getPublishedQueries(
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
        return this._getPublishedQueriesByConsentContracts(
          consentContractsMap,
          fromBlock,
          toBlock,
        );
      });
  }

  private _getPublishedQueriesByConsentContracts(
    consentContractsMap: Map<EVMContractAddress, IConsentContract>,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<
    Map<EVMContractAddress, IpfsCID[]>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
  > {
    return ResultUtils.combine(
      Array.from(consentContractsMap.values()).map((consentContract) => {
        return this._getPublishedQueriesPerContract(
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
      (contractCidListEntries) =>
        new Map<EVMContractAddress, IpfsCID[]>(contractCidListEntries),
    );
  }

  private _getPublishedQueriesPerContract(
    consentContract: IConsentContract,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<IpfsCID[], ConsentContractError> {
    return this._getRequestForDataList(consentContract, fromBlock, toBlock).map(
      (r4dList) => r4dList.map((r4d) => r4d.requestedCID),
    );
  }

  private _getRequestForDataList(
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

  private _getPossibleRewards(
    contractsToCids: Map<EVMContractAddress, IpfsCID[]>,
  ): ResultAsync<
    Map<EVMContractAddress, PossibleReward[]>,
    EvaluationError | AjaxError
  > {
    return ResultUtils.combine(
      Array.from(contractsToCids.keys()).map((contractAddress) => {
        return this._getPossibleRewardsPerContract(
          contractAddress,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          contractsToCids.get(contractAddress)!,
        );
      }),
    ).map((contractToRewardsEntries) => new Map(contractToRewardsEntries));
  }

  private _getPossibleRewardsPerContract(
    contractAddress: EVMContractAddress,
    publishedQueryCids: IpfsCID[],
  ): ResultAsync<
    [EVMContractAddress, PossibleReward[]],
    EvaluationError | AjaxError
  > {
    return this._getAllRewardsOfCampaign(publishedQueryCids).map(
      (allRewards) => [contractAddress, allRewards],
    );
  }

  private _getAllRewardsOfCampaign(
    publishedQueryCids: IpfsCID[],
  ): ResultAsync<PossibleReward[], EvaluationError | AjaxError> {
    return ResultUtils.combine(
      publishedQueryCids.map((cid) =>
        this._getPossibleRewardsPerQuery(cid, this.QUERY_GET_TIMEOUT),
      ),
    ).map((rewardsOfAllQueries) =>
      Array.from(new Set(rewardsOfAllQueries.flat())),
    );
  }

  private _getPossibleRewardsPerQuery(
    queryCid: IpfsCID,
    timeoutMs: number,
  ): ResultAsync<PossibleReward[], AjaxError | EvaluationError> {
    return this._getQueryWithTimeout(queryCid, timeoutMs).andThen(
      (sdqlQuery) => {
        if (sdqlQuery == null) {
          return okAsync([]);
        }
        return this.queryParsingEngine.getPossibleRewards(sdqlQuery);
      },
    );
  }

  private _getQueryWithTimeout(
    queryCid: IpfsCID,
    timeoutMs: number,
  ): ResultAsync<SDQLQuery | null, AjaxError> {
    return this.sdqlQueryRepo.getByCID(queryCid, timeoutMs);
  }
}
