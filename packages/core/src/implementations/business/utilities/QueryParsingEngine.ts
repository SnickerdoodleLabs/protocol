import {
  AdKey,
  CompensationId,
  DataPermissions,
  ERewardType,
  EVMContractAddress,
  EligibleAd,
  EvaluationError,
  ExpectedReward,
  IInsights,
  ISDQLAd,
  ISDQLCompensations,
  InsightString,
  IpfsCID,
  ParserError,
  PersistenceError,
  PossibleReward,
  QueryExpiredError,
  QueryFormatError,
  SDQLQuery,
  SDQL_Return,
  SubqueryKey,
} from "@snickerdoodlelabs/objects";
import {
  AST,
  ISDQLQueryUtils,
  ISDQLQueryUtilsType,
  SDQLParser,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync } from "neverthrow";
import { BaseOf } from "ts-brand";

import { IQueryParsingEngine } from "@core/interfaces/business/utilities/index.js";
import {
  IAdContentRepository,
  IAdDataRepository,
  IAdDataRepositoryType,
  IAdRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IQueryFactories,
  IQueryFactoriesType,
} from "@core/interfaces/utilities/factory/index.js";
import { AST_Evaluator } from "./query/AST_Evaluator";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  public constructor(
    @inject(IQueryFactoriesType)
    protected queryFactories: IQueryFactories,
    @inject(ISDQLQueryUtilsType)
    protected queryUtils: ISDQLQueryUtils,
    @inject(IAdRepositoryType)
    protected adContentRepository: IAdContentRepository,
    @inject(IAdDataRepositoryType)
    protected adDataRepository: IAdDataRepository,
  ) {}

  public getPermittedQueryIdsAndExpectedRewards(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<[SubqueryKey[], ExpectedReward[]], EvaluationError> {
    throw new Error("");
  }

  public getPossibleRewards(
    query: SDQLQuery,
  ): ResultAsync<PossibleReward[], ParserError> {
    throw new Error("");
  }

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsights,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return errAsync(new EvaluationError("Not implemented"));
    // return this.queryFactories
    //   .makeParserAsync(query.cid, query.query)
    //   .andThen((sdqlParser) => {
    //     return this.gatherInsights(sdqlParser, query.cid, dataPermissions);
    //   });
  }

  protected constructExpectedRewards(
    iSDQLCompensationsMap: Map<CompensationId, ISDQLCompensations>,
  ): ExpectedReward[] {
    const expectedRewardList: ExpectedReward[] = [];
    for (const currentKeyAsString in iSDQLCompensationsMap) {
      const currentSDQLCompensationsKey = CompensationId(currentKeyAsString);
      const currentSDQLCompensationsObject: ISDQLCompensations =
        iSDQLCompensationsMap[currentSDQLCompensationsKey];

      expectedRewardList.push(
        new ExpectedReward(
          currentSDQLCompensationsKey,
          currentSDQLCompensationsObject.description,
          currentSDQLCompensationsObject.chainId,
          JSON.stringify(currentSDQLCompensationsObject.callback),
          ERewardType.Direct,
        ),
      );
    }
    return expectedRewardList;
  }

  protected constructAndSaveEligibleAds(
    eligibleAdsMap: Map<AdKey, ISDQLAd>,
    queryCID: IpfsCID,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, PersistenceError> {
    const eligibleAdList = this.adsMapToEligibleAdObjects(
      eligibleAdsMap,
      queryCID,
      consentContractAddress,
    );

    return this.adDataRepository.saveEligibleAds(eligibleAdList);
  }

  protected adsMapToEligibleAdObjects(
    iSDQLAdsMap: Map<AdKey, ISDQLAd>,
    queryCID: IpfsCID,
    consentContractAddress: EVMContractAddress,
  ): EligibleAd[] {
    const eligibleAdList: EligibleAd[] = [];
    for (const currentKeyAsString in iSDQLAdsMap) {
      const currentAdKey = AdKey(currentKeyAsString);
      const currentSDQLAdObject: ISDQLAd = iSDQLAdsMap[AdKey(currentAdKey)];

      eligibleAdList.push(
        new EligibleAd(
          consentContractAddress,
          queryCID,
          currentAdKey,
          currentSDQLAdObject.name,
          currentSDQLAdObject.content,
          currentSDQLAdObject.text,
          currentSDQLAdObject.displayType,
          currentSDQLAdObject.weight,
          currentSDQLAdObject.expiry,
          currentSDQLAdObject.keywords,
        ),
      );
    }
    return eligibleAdList;
  }


  protected getAstAndAstEvaluator(
    sdqlParser: SDQLParser,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    [AST, AST_Evaluator],
    QueryFormatError | QueryExpiredError | ParserError
  > {
    return sdqlParser.buildAST().map((ast: AST) => {
      return [ast, this.queryFactories.makeAstEvaluator(dataPermissions)];
    });
  }

  protected SDQLReturnToInsight(
    sdqlR: SDQL_Return | null,
  ): InsightString | null {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;

    if (actualTypeData == null) {
      return null;
    } else if (typeof actualTypeData == "string") {
      return InsightString(actualTypeData);
    } else {
      return InsightString(JSON.stringify(actualTypeData));
    }
  }
}
