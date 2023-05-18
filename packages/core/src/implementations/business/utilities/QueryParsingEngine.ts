import {
  AdKey,
  CompensationKey,
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
  SubQueryKey,
  IQueryDeliveryItems,
  IQueryDeliveryAds,
  IQueryDeliveryInsights,
} from "@snickerdoodlelabs/objects";
import {
  AST,
  AST_Evaluator,
  IQueryFactories,
  IQueryFactoriesType,
  IQueryRepository,
  IQueryRepositoryType,
  ISDQLQueryUtils,
  ISDQLQueryUtilsType,
  SDQLParser,
} from "@snickerdoodlelabs/query-parser";
import { insightDeliveryTypes } from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { BaseOf } from "ts-brand";

import { IQueryParsingEngine } from "@core/interfaces/business/utilities/index.js";
import {
  IAdContentRepository,
  IAdDataRepository,
  IAdDataRepositoryType,
  IAdRepositoryType,
} from "@core/interfaces/data/index.js";
@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  public constructor(
    @inject(IQueryFactoriesType)
    protected queryFactories: IQueryFactories,
    @inject(IQueryRepositoryType)
    protected queryRepository: IQueryRepository,
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
  ): ResultAsync<[SubQueryKey[], ExpectedReward[]], EvaluationError> {
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
    IQueryDeliveryItems,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    // return errAsync(new EvaluationError("Not implemented"));
    return this.queryFactories
      .makeParserAsync(query.cid, query.query)
      .andThen((sdqlParser) => {
        return this.gatherDeliveryItems(sdqlParser, query.cid, dataPermissions);
      });
  }

  protected gatherDeliveryItems(
    sdqlParser: SDQLParser,
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryItems,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    // return errAsync(new EvaluationError("Not implemented"));
    return sdqlParser.buildAST().andThen((ast: AST) => {
      const astEvaluator = this.queryFactories.makeAstEvaluator(
        cid,
        dataPermissions,
      );

      const insightProm = this.gatherDeliveryInsights(
        ast,
        cid,
        dataPermissions,
      );

      const adSigProm = this.gatherDeliveryAds(
        sdqlParser,
        cid,
        dataPermissions,
      );

      const combined = ResultUtils.combine([insightProm, adSigProm]).map(
        ([insightWithProofs, adSigs]) => {
          return {
            insights: insightWithProofs,
            ads: adSigs,
          };
        },
      );

      // return ResultUtils.combine(
      //   this.evalReturns(ast, dataPermissions, astEvaluator),
      // ).andThen((insightResults) => {
      //   const insights = insightResults.map(this.SDQLReturnToInsightString);

      //   return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>(
      //     [insights, rewards],
      //   );
      // });

      // return ResultUtils.combine([
      //   this.gatherDeliveryInsights(sdqlParser, cid, dataPermissions),
      //   this.gatherDeliveryAds(sdqlParser, cid, dataPermissions),
      // ]).map([insights, ads] => {
      // const items = {
      //   insights: insights;
      //   ads: ads;
      // } as IQueryDeliveryItems;
      //   return items;
      // })
      return errAsync(new EvaluationError("Not implemented"));
    });
  }

  protected gatherDeliveryInsights(
    ast: AST,
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryInsights,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return errAsync(new EvaluationError("Not implemented"));
  }

  protected gatherDeliveryAds(
    sdqlParser: SDQLParser,
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryAds,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return errAsync(new EvaluationError("Not implemented"));
  }

  protected constructExpectedRewards(
    iSDQLCompensationsMap: Map<CompensationKey, ISDQLCompensations>,
  ): ExpectedReward[] {
    const expectedRewardList: ExpectedReward[] = [];
    for (const currentKeyAsString in iSDQLCompensationsMap) {
      const currentSDQLCompensationsKey = CompensationKey(currentKeyAsString);
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
    cid: IpfsCID,
    sdqlParser: SDQLParser,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    [AST, AST_Evaluator],
    QueryFormatError | QueryExpiredError | ParserError
  > {
    return sdqlParser.buildAST().map((ast: AST) => {
      return [ast, this.queryFactories.makeAstEvaluator(cid, dataPermissions)];
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
