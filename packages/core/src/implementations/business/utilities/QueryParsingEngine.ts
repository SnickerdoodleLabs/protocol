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
  ProofString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import {
  AST,
  AST_Evaluator,
  AST_SubQuery,
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
import { ResultAsync, errAsync, okAsync } from "neverthrow";
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

  

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryItems,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return this.parseQuery(query).andThen((ast) => {
      return this.gatherDeliveryItems(ast, query.cid, dataPermissions);
    });
  }

  public parseQuery(query: SDQLQuery): ResultAsync<AST, ParserError> {
    return this.queryFactories.makeParserAsync(query.cid, query.query).andThen( (sdqlParser) => sdqlParser.buildAST());
  }

  protected gatherDeliveryItems(
    ast: AST,
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryItems,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {

      const astEvaluator = this.queryFactories.makeAstEvaluator(
        cid,
        dataPermissions,
      );

      const insightProm = this.gatherDeliveryInsights(ast, astEvaluator);

      const adSigProm = this.gatherDeliveryAds(
        ast,
        cid,
        dataPermissions,
      );

      return ResultUtils.combine([insightProm, adSigProm]).map(
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

  }

  protected gatherDeliveryInsights(
    ast: AST,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<
    IQueryDeliveryInsights,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    const subQueryArray = Array.from(ast.subqueries);
    return ResultUtils.combine(
      subQueryArray.map(([_qName, subQuery]) => {
        return astEvaluator.evalAny(subQuery);
      }),
    ).map((insights) => {
      return this.createDeliverInsightObject(insights, subQueryArray);
    });
  }

  protected createDeliverInsightObject(
    insights: SDQL_Return[],
    subQueryArray: [SDQL_Name, AST_SubQuery][],
  ) {
    return subQueryArray.reduce<IQueryDeliveryInsights>(
      (deliveryInsights, [queryName], currentIndex) => {
        const insightString = this.SDQLReturnToInsight(insights[currentIndex]);
        if (insightString) {
          deliveryInsights[queryName] = {
            insight: InsightString(insightString),
            proof: ProofString(""),
          };
        } else {
          deliveryInsights[queryName] = null;
        }
        return deliveryInsights;
      },
      {},
    );
  }

  protected gatherDeliveryAds(
    ast: AST,
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryAds,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    const gatherDeliveryAds: IQueryDeliveryAds = {};
    ast.ads.forEach((value, key, map) => {
      gatherDeliveryAds[value.key] = null;
    });
    return okAsync(gatherDeliveryAds);
    //return errAsync(new EvaluationError("Not implemented"));
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
