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
  ReturnKey,
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
    return this.queryUtils
      .filterQueryByPermissions(query.query, dataPermissions)
      .andThen((queryFilteredByPermissions) => {
        return this.constructAndSaveEligibleAds(
          queryFilteredByPermissions.eligibleAdsMap,
          query.cid,
          consentContractAddress,
        ).map(() => {
          return [
            queryFilteredByPermissions.permittedQueryIds,
            this.constructExpectedRewards(
              queryFilteredByPermissions.expectedCompensationsMap,
            ),
          ] as [QueryIdentifier[], ExpectedReward[]];
        });
      });
  }

  public handleQuery(
    query: SDQLQuery,
  ): ResultAsync<
    [IInsights, EligibleReward[]],
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return this.queryFactories
      .makeParserAsync(query.cid, query.query)
      .andThen((sdqlParser) => {
        return this.gatherInsights(sdqlParser, query.cid);
      })
      .map((insights) => {
        return [insights, []] as [IInsights, EligibleReward[]];
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
  ): ResultAsync<
    IInsights,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return this.getAstAndAstEvaluator(sdqlParser, cid).andThen(
      ([ast, astEvaluator]) => {
        return this.evalReturns(ast, astEvaluator);
      },
    );
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

  protected evalReturns(
    ast: AST,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<
    IInsights,
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    return ResultUtils.combine(this.evalAllReturnLogic(ast, astEvaluator)).map(
      (results) => {
        return Object.fromEntries(
          results
            .filter(([returnKey, result]) => result && result != "")
            .map(([returnKey, result]) => [
              returnKey,
              this.SDQLReturnToInsightString(result),
            ]),
        ) as IInsights;
      },
    );
  }

  private evalAllReturnLogic(
    ast: AST,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<[ReturnKey, SDQL_Return], EvaluationError>[] {
    return [...ast.returns.expressions.keys()].map((returnKey) =>
      astEvaluator
        .evalAny(ast.returns.expressions.get(returnKey))
        .map((insight) => [ReturnKey(returnKey), insight]),
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
