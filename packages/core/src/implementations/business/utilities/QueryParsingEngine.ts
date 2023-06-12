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
    return this.queryFactories
      .makeParserAsync(query.cid, query.query)
      .andThen((sdqlParser) => sdqlParser.buildAST());
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

    const adSigProm = this.gatherDeliveryAds(ast, cid, dataPermissions);

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
    const astInsightArray = Array.from(ast.insights);
    const insightMapResult = astInsightArray.map(([_qName, astInsight]) => {
      return astEvaluator.evalInsight(astInsight).map((insight) => {
        return [_qName, insight] as [SDQL_Name, SDQL_Return];
      });
    });
    return ResultUtils.combine(insightMapResult).map((insightMap) => {
      return this.createDeliveryInsightObject(insightMap);
    });
  }

  protected createDeliveryInsightObject(
    insightMap: [SDQL_Name, SDQL_Return][],
  ) {
    return insightMap.reduce<IQueryDeliveryInsights>(
      (deliveryInsights, [insightName, insight], currentIndex) => {
        if (insight !== null) {
          deliveryInsights[insightName] = {
            insight: this.SDQLReturnToInsight(insight),
            proof: this.calculateInsightProof(insight),
          };
        } else {
          deliveryInsights[insightName] = null;
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
    const adSigProm: IQueryDeliveryAds = {};
    ast.ads.forEach((value, key, map) => {
      adSigProm[value.key] = null;
    });
    return okAsync(adSigProm);
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

  protected calculateInsightProof(
    insightSource: SDQL_Return,
  ): ProofString | null {
    if (insightSource === null) {
      return null;
    }
    return ProofString("");
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
