import {
  AdKey,
  DataPermissions,
  EVMContractAddress,
  EligibleAd,
  EvaluationError,
  ISDQLAd,
  InsightString,
  IpfsCID,
  ParserError,
  PersistenceError,
  QueryExpiredError,
  QueryFormatError,
  SDQLQuery,
  SDQL_Return,
  IQueryDeliveryItems,
  IQueryDeliveryAds,
  IQueryDeliveryInsights,
  ProofString,
  SDQL_Name,
  DuplicateIdInSchema,
  MissingTokenConstructorError,
  EvalNotImplementedError,
  MissingASTError,
  PossibleReward,
  CompensationKey,
  InsightKey,
  PublicEvents,
  EQueryEvents,
  QueryPerformanceEvent,
  EStatus,
  AccountIndexingError,
  AjaxError,
  InvalidParametersError,
  MethodSupportError,
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
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { BaseOf } from "ts-brand";

import { IQueryParsingEngine } from "@core/interfaces/business/utilities/index.js";
import {
  IAdContentRepository,
  IAdDataRepository,
  IAdDataRepositoryType,
  IAdRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

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
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}

  public handleQuestionnaire(
    questionnaire: SDQLQuery,     
    dataPermissions: DataPermissions,
    ): ResultAsync<
    IQueryDeliveryItems,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
  return this.contextProvider.getContext().andThen((context) => {
    context.publicEvents.queryPerformance.next(
      new QueryPerformanceEvent(
        EQueryEvents.QueryEvaluation,
        EStatus.Start,
        questionnaire.cid,
      ),
    );
    context.publicEvents.queryPerformance.next(
      new QueryPerformanceEvent(
        EQueryEvents.QueryParsing,
        EStatus.Start,
        questionnaire.cid,
      ),
    );
    console.log("questionnaire is: " + JSON.stringify(questionnaire));
    return this.parseQuestionnaire(questionnaire)
      .andThen((ast) => {
        console.log("ast is: " + JSON.stringify(ast));

        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.QueryParsing,
            EStatus.End,
            questionnaire.cid,
          ),
        );
        return this.gatherDeliveryItems(ast, questionnaire.cid, dataPermissions).map(
          (result) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.QueryEvaluation,
                EStatus.End,
                questionnaire.cid,
              ),
            );
            console.log("delivery items are: " + result);
            return result;
          },
        );
      })
      .mapErr((err) => {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.QueryEvaluation,
            EStatus.End,
            questionnaire.cid,
            undefined,
            err,
          ),
        );
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.QueryParsing,
            EStatus.End,
            questionnaire.cid,
            undefined,
            err,
          ),
        );
        return err;
      });
  });

}

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryItems,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      context.publicEvents.queryPerformance.next(
        new QueryPerformanceEvent(
          EQueryEvents.QueryEvaluation,
          EStatus.Start,
          query.cid,
        ),
      );
      context.publicEvents.queryPerformance.next(
        new QueryPerformanceEvent(
          EQueryEvents.QueryParsing,
          EStatus.Start,
          query.cid,
        ),
      );
      return this.parseQuery(query)
        .andThen((ast) => {
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.QueryParsing,
              EStatus.End,
              query.cid,
            ),
          );
          return this.gatherDeliveryItems(ast, query.cid, dataPermissions).map(
            (result) => {
              context.publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(
                  EQueryEvents.QueryEvaluation,
                  EStatus.End,
                  query.cid,
                ),
              );
              return result;
            },
          );
        })
        .mapErr((err) => {
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.QueryEvaluation,
              EStatus.End,
              query.cid,
              undefined,
              err,
            ),
          );
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.QueryParsing,
              EStatus.End,
              query.cid,
              undefined,
              err,
            ),
          );
          return err;
        });
    });
  }

  public parseQuestionnaire(
    query: SDQLQuery,
  ): ResultAsync<
  AST,
  | EvaluationError
  | QueryFormatError
  | QueryExpiredError
  | ParserError
  | EvaluationError
  | QueryFormatError
  | QueryExpiredError
  | MissingTokenConstructorError
  | DuplicateIdInSchema
  | MissingASTError
> {
    return this.queryFactories
      .makeParserAsync(query.cid, query.query)
      .andThen((sdqlParser) => sdqlParser.buildQuestionnaireAST());
}

  public parseQuery(
    query: SDQLQuery,
  ): ResultAsync<
    AST,
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | MissingASTError
  > {
    return this.queryFactories
      .makeParserAsync(query.cid, query.query)
      .andThen((sdqlParser) => sdqlParser.buildAST());
  }

  /** Used for reward generation on the SPA. Purpose is to show all the rewards to the user
   *  should not be used for anything else !
   */
  public constructAllTheRewardsFromQuery(
    query: SDQLQuery,
  ): ResultAsync<
    PossibleReward[],
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | MissingASTError
    | PersistenceError
    | EvalNotImplementedError
  > {
    return this.parseQuery(query).andThen((ast) => {
      const [compensationKeys, insightAndAdKeys] = this.getTotalQueryKeys(ast);
      return this.queryUtils.filterCompensationsForPreviews(
        query.cid,
        query.query,
        compensationKeys,
        insightAndAdKeys,
      );
    });
  }

  public getPossibleQueryDeliveryItems(
    query: SDQLQuery,
  ): ResultAsync<
    IQueryDeliveryItems,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.handleQuery(query, DataPermissions.createWithAllPermissions());
  }

  /** Used for reward generation on the SPA. Purpose is to show all the rewards to the user
   *  should not be used for anything else !
   */
  protected getTotalQueryKeys(
    ast: AST,
  ): [CompensationKey[], (InsightKey | AdKey)[]] {
    const compensationKeys: CompensationKey[] = [
      ...ast.compensations.keys(),
    ].map((compKey) => CompensationKey(compKey));

    const insightKeys: InsightKey[] = [...ast.insights.keys()].map(
      (insightKey) => InsightKey(insightKey),
    );

    const adKeys: AdKey[] = [...ast.ads.keys()].map((adKey) => AdKey(adKey));
    return [compensationKeys, [...insightKeys, ...adKeys]];
  }

  protected getInsightAndAdKeys({
    ads,
    insights,
  }: IQueryDeliveryItems): (InsightKey | AdKey)[] {
    const answeredInsightAndAdKeys: (InsightKey | AdKey)[] = [];

    if (ads) {
      Object.entries(ads).forEach(([adKey, adValue]) => {
        if (adValue !== null) {
          answeredInsightAndAdKeys.push(AdKey(adKey));
        }
      }, []);
    }

    if (insights) {
      Object.entries(insights).forEach(([insightKey, insightValue]) => {
        if (insightValue !== null) {
          answeredInsightAndAdKeys.push(InsightKey(insightKey));
        }
      });
    }

    return answeredInsightAndAdKeys;
  }

  protected gatherDeliveryItems(
    ast: AST,
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IQueryDeliveryItems,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    const astEvaluator = this.queryFactories.makeAstEvaluator(
      cid,
      dataPermissions,
      ast.queryTimestamp,
    );

    const insightProm = this.gatherDeliveryInsights(ast, astEvaluator);
    //Will become async in the future
    const adSigProm = this.gatherDeliveryAds(ast, cid, dataPermissions);

    return ResultUtils.combine([insightProm]).map(([insightWithProofs]) => {
      return {
        insights: insightWithProofs,
        ads: adSigProm,
      };
    });
  }

  protected gatherDeliveryInsights(
    ast: AST,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<
    IQueryDeliveryInsights,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
    | EvaluationError
    | PersistenceError
    | EvalNotImplementedError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
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
  ): IQueryDeliveryInsights {
    return insightMap.reduce<IQueryDeliveryInsights>(
      (deliveryInsights, [insightName, insight]) => {
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
  ): IQueryDeliveryAds {
    const adSigProm: IQueryDeliveryAds = {};
    ast.ads.forEach((value) => {
      adSigProm[value.key] = null;
    });
    return adSigProm;
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
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | MissingASTError
  > {
    return sdqlParser.buildAST().map((ast: AST) => {
      return [
        ast,
        this.queryFactories.makeAstEvaluator(
          cid,
          dataPermissions,
          ast.queryTimestamp,
        ),
      ];
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
