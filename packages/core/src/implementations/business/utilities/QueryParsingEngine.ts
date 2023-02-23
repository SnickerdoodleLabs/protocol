import {
  DataPermissions,
  EligibleReward,
  EvaluationError,
  InsightString,
  IpfsCID,
  QueryExpiredError,
  QueryFormatError,
  SDQLQuery,
  SDQL_Return,
  QueryIdentifier,
  ExpectedReward,
  ERewardType,
  IDynamicRewardParameter,
  ISDQLCompensations,
  CompensationId,
  AdKey,
  ISDQLAd,
  EligibleAd,
  EVMContractAddress,
  PersistenceError,
  ParserError,
  IInsights,
  IInsightsReturns,
  IInsightsQueries,
} from "@snickerdoodlelabs/objects";
import {
  AST,
  AST_Query,
  ISDQLQueryUtils,
  ISDQLQueryUtilsType,
  SDQLParser,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { BaseOf } from "ts-brand";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/AST_Evaluator";
import {
  IQueryParsingEngine,
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities/index.js";
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

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    parameters?: IDynamicRewardParameter[],
  ): ResultAsync<
    [IInsights, EligibleReward[]],
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    const schemaString = query.query;
    const cid: IpfsCID = query.cid;

    return this.queryFactories
      .makeParserAsync(cid, schemaString)
      .andThen((sdqlParser) => {
        return this.gatherInsights(sdqlParser, cid, dataPermissions);
      })
      .map((insights) => {
        return [insights, []] as [IInsights, EligibleReward[]];
      });
  }

  protected gatherInsights(
    sdqlParser: SDQLParser,
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsights,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return this.buildAstAndEvaluator(sdqlParser, cid).andThen(
      ([ast, astEvaluator]) => {
        const containsReturns =
          this.containsReturns(sdqlParser) &&
          this.containsReturnsLogic(sdqlParser);
        return ResultUtils.combine([
          this.evalAllReturns(
            containsReturns,
            ast,
            astEvaluator,
            dataPermissions,
          ),
          this.evalAllQueries(sdqlParser, ast, dataPermissions),
        ]).map(([returns, queryAnswers]) => {
          return {
            queries: queryAnswers,
            returns: returns,
          };
        });
      },
    );
  }

  protected evalAllQueries(
    sdqlParser: SDQLParser,
    ast: AST,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsightsQueries,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return this.getPermittedQueries(sdqlParser, ast, dataPermissions).andThen(
      (queries) => {
        return ResultUtils.combine(this.evalQueries(queries)).map((result) => {
          return Object.fromEntries(result) as IInsightsQueries;
        });
      },
    );
  }

  protected evalAllReturns(
    containsReturns: boolean,
    ast: AST,
    astEvaluator: AST_Evaluator,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    IInsightsReturns,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    if (!containsReturns) {
      return okAsync({});
    }

    return ResultUtils.combine(
      this.evalReturns(ast, dataPermissions, astEvaluator),
    ).map((result) => {
      return Object.fromEntries(result) as IInsightsReturns;
    });
  }

  protected buildAstAndEvaluator(
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

  protected containsReturns(sdqlParser: SDQLParser): boolean {
    return !!sdqlParser.returns;
  }

  protected containsReturnsLogic(sdqlParser: SDQLParser): boolean {
    return !!sdqlParser.logicReturns;
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
          permittedQueryIds,
          this.getAllQueriesFromAst(ast),
        );
      });
  }

  protected getAllQueriesFromAst(ast: AST): AST_Query[] {
    return Array.from(ast.queries.values());
  }

  protected filterQueriesByPermittedQueryIds(
    permittedQueryIds: QueryIdentifier[],
    allQueries: AST_Query[],
  ): AST_Query[] {
    const permittedQueryIdsSet = new Set(permittedQueryIds);
    return allQueries.filter((query) => {
      return permittedQueryIdsSet.has(QueryIdentifier(query.name));
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

  private evalReturns(
    ast: AST,
    dataPermissions: DataPermissions,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<[string, InsightString], EvaluationError>[] {
    return [...ast.logic.returns.keys()].map((returnStr) => {
      const requiredPermissions = ast.logic.getReturnPermissions(returnStr);

      if (dataPermissions.contains(requiredPermissions)) {
        return astEvaluator
          .evalAny(ast.logic.returns.get(returnStr))
          .map((insight) => [
            returnStr,
            this.SDQLReturnToInsightString(insight),
          ]);
      } else {
        return okAsync(["", InsightString("")]);
      }
    });
  }

  private evalQueries(
    queries: AST_Query[],
  ): ResultAsync<[QueryIdentifier, InsightString], EvaluationError>[] {
    return queries.map((query) =>
      this.queryRepository
        .get(IpfsCID(""), query)
        .map((res) => [
          QueryIdentifier(query.name),
          this.SDQLReturnToInsightString(res),
        ]),
    );
  }

  protected SDQLReturnToInsightString(sdqlR: SDQL_Return): InsightString {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;

    if (typeof actualTypeData == "string") {
      return InsightString(actualTypeData);
    } else if (actualTypeData == null) {
      return InsightString("");
    } else {
      return InsightString(JSON.stringify(actualTypeData));
    }
  }
}
