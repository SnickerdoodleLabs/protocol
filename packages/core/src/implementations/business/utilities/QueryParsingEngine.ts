import {
  AdKey,
  CompensationId,
  DataPermissions,
  DuplicateIdInSchema,
  EligibleAd,
  ERewardType,
  EvaluationError,
  EVMContractAddress,
  ExpectedReward,
  IInsights,
  IInsightsQueries,
  IInsightsReturns,
  InsightString,
  IpfsCID,
  ISDQLAd,
  ISDQLCompensations,
  MissingTokenConstructorError,
  ParserError,
  PersistenceError,
  PossibleReward,
  QueryExpiredError,
  QueryFilteredByPermissions,
  QueryFormatError,
  QueryIdentifier,
  SDQLQuery,
  SDQLString,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST,
  AST_Query,
  ISDQLQueryUtils,
  ISDQLQueryUtilsType,
  SDQLParser,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { BaseOf } from "ts-brand";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/index.js";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities/index.js";
import {
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities/query/index.js";
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
  ): ResultAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError> {
    const queryString = query.query;
    const cid: IpfsCID = query.cid;

    return this.queryUtils
      .filterQueryByPermissions(queryString, dataPermissions)
      .andThen((queryFilteredByPermissions) => {
        return this.constructAndSaveEligibleAds(
          queryFilteredByPermissions.eligibleAdsMap,
          cid,
          consentContractAddress,
        ).andThen(() => {
          const expectedRewardList = this.constructExpectedRewards(
            queryFilteredByPermissions.expectedCompensationsMap,
          );

          return okAsync<[QueryIdentifier[], ExpectedReward[]]>([
            queryFilteredByPermissions.permittedQueryIds,
            expectedRewardList,
          ]);
        });
      });
  }

  public getPossibleRewards(
    query: SDQLQuery,
  ): ResultAsync<PossibleReward[], ParserError> {
    return this.filterQueryWithAllPermissions(query.query).andThen(
      (queryFilteredByPermissions) => {
        return this.constructPossibleRewards(
          query,
          queryFilteredByPermissions.expectedCompensationsMap,
          queryFilteredByPermissions.eligibleAdsMap,
          query.cid,
        );
      },
    );
  }

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsights,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return this.queryFactories
      .makeParserAsync(query.cid, query.query)
      .andThen((sdqlParser) => {
        return this.gatherInsights(sdqlParser, query.cid, dataPermissions);
      });
  }

  /**
   * Returns an object containing all "eligible compensations" and "eligible ads"
   * the query has to offer, because the query is evaluated as if the user granted
   * all permissions.
   *
   * @param queryString Content of query as string
   */
  protected filterQueryWithAllPermissions(
    queryString: SDQLString,
  ): ResultAsync<
    QueryFilteredByPermissions,
    | QueryFormatError
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.queryUtils.filterQueryByPermissions(
      queryString,
      DataPermissions.createWithAllPermissions(),
    );
  }

  protected constructPossibleRewards(
    query: SDQLQuery,
    compensationsMap: Map<CompensationId, ISDQLCompensations>,
    adsMap: Map<AdKey, ISDQLAd>,
    cid: IpfsCID,
  ): ResultAsync<
    PossibleReward[],
    | QueryFormatError
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.queryFactories
      .makeParserAsync(cid, query.query)
      .andThen((parser) => {
        return parser.buildAST().map(() => parser);
      })
      .andThen((parser) => {
        const rewardList: PossibleReward[] = [];
        for (const currentKeyAsString in compensationsMap) {
          const currentCompId = CompensationId(currentKeyAsString);
          rewardList.push(
            new PossibleReward(
              cid,
              currentCompId,
              this.queryUtils.getQueryTypeDependencies(parser, currentCompId),
              compensationsMap[currentCompId].name,
              compensationsMap[currentCompId].image,
              compensationsMap[currentCompId].description,
              compensationsMap[currentCompId].chainId,
              ERewardType.Direct,
            ),
          );
        }
        return okAsync(rewardList);
      });
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

  protected gatherInsights(
    sdqlParser: SDQLParser,
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsights,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    // return this.getAstAndAstEvaluator(sdqlParser, cid).andThen(
    //   ([ast, astEvaluator]) => {
    //     return ResultUtils.combine([
    //       this.getAndEvalPermittedReturns(ast, astEvaluator, dataPermissions),
    //       this.getAndEvalPermittedQueries(sdqlParser, ast, dataPermissions),
    //     ]).map(([returnAnswers, queryAnswers]) => {
    //       return {
    //         queries: queryAnswers,
    //         returns: returnAnswers,
    //       };
    //     });
    //   },
    // );
    return errAsync(new EvaluationError("Not implemented"));
  }

  protected getAstAndAstEvaluator(
    sdqlParser: SDQLParser,
    cid: IpfsCID,
  ): ResultAsync<
    [AST, AST_Evaluator],
    QueryFormatError | QueryExpiredError | ParserError
  > {
    return sdqlParser.buildAST().map((ast: AST) => {
      return [
        ast,
        this.queryFactories.makeAstEvaluator(cid, ast, this.queryRepository),
      ];
    });
  }

  protected getAndEvalPermittedQueries(
    sdqlParser: SDQLParser,
    ast: AST,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsightsQueries,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return this.getPermittedQueries(sdqlParser, ast, dataPermissions).andThen(
      (permittedQueries) => {
        const allQueries = this.getAllQueriesFromAst(ast);

        return ResultUtils.combine(this.evalQueries(permittedQueries)).map(
          (results) => {
            return Object.fromEntries(
              allQueries.map((query) => {
                const queryIdentifier = QueryIdentifier(query.name);
                const sdqlReturn = (results.find(
                  (result) => result[0] === queryIdentifier,
                ) || [queryIdentifier, null])[1];
                return [query.name, this.SDQLReturnToInsight(sdqlReturn)];
              }),
            ) as IInsightsQueries;
          },
        );
      },
    );
  }

  protected getPermittedQueries(
    sdqlParser: SDQLParser,
    ast: AST,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    AST_Query[],
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return this.queryUtils
      .getPermittedQueryIds(sdqlParser, dataPermissions)
      .map((permittedQueryIds) => {
        return this.filterQueriesByPermittedQueryIds(
          this.getAllQueriesFromAst(ast),
          permittedQueryIds,
        );
      });
  }

  protected getAllQueriesFromAst(ast: AST): AST_Query[] {
    return Array.from(ast.queries.values());
  }

  protected filterQueriesByPermittedQueryIds(
    allQueries: AST_Query[],
    permittedQueryIds: QueryIdentifier[],
  ): AST_Query[] {
    const permittedQueryIdsSet = new Set(permittedQueryIds);
    return allQueries.filter((query) => {
      return permittedQueryIdsSet.has(QueryIdentifier(query.name));
    });
  }

  protected getAndEvalPermittedReturns(
    ast: AST,
    astEvaluator: AST_Evaluator,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsightsReturns,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    const allReturns = [...ast.logic.returns.keys()];

    return ResultUtils.combine(
      this.evalReturns(
        ast,
        astEvaluator,
        this.getPermittedReturnExpressions(ast, dataPermissions),
      ),
    ).map((results) => {
      return Object.fromEntries(
        allReturns.map((returnExpr) => {
          const sdqlReturn = (results.find(
            (result) => result[0] === returnExpr,
          ) || [returnExpr, null])[1];

          return [returnExpr, this.SDQLReturnToInsight(sdqlReturn)];
        }),
      ) as IInsightsReturns;
    });
  }

  // protected getPermittedReturnExpressions(
  //   ast: AST,
  //   dataPermissions: DataPermissions,
  // ): string[] {
  //   return [...ast.logic.returns.keys()].filter((returnExpr) => {
  //     const requiredPermissions = ast.logic.getReturnPermissions(returnExpr);
  //     return dataPermissions.contains(requiredPermissions);
  //   });
  // }

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

  private evalQueries(
    queries: AST_Query[],
  ): ResultAsync<[QueryIdentifier, SDQL_Return], EvaluationError>[] {
    return queries.map((query) =>
      this.queryRepository
        .get(IpfsCID(""), query)
        .map((res) => [QueryIdentifier(query.name), res]),
    );
  }

  private evalReturns(
    ast: AST,
    astEvaluator: AST_Evaluator,
    returnExpressions: string[],
  ): ResultAsync<[string, SDQL_Return], EvaluationError>[] {
    return returnExpressions.map((returnExpr) =>
      astEvaluator
        .evalAny(ast.logic.returns.get(returnExpr))
        .map((insight) => [returnExpr, insight]),
    );
  }
}
