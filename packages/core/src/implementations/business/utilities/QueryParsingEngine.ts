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
  IDynamicRewardParameter,
  CompensationId,
} from "@snickerdoodlelabs/objects";
import { AST, ISDQLQueryUtils, ISDQLQueryUtilsType } from "@snickerdoodlelabs/query-parser";
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
    protected queryUtils: ISDQLQueryUtils
  ) {}

  public getPermittedQueryIdsAndExpectedRewards(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError> {
    const schemaString = query.query;
    const queryCid = query.cid;

    return this.queryFactories.makeParserAsync(queryCid, schemaString)
      .andThen((parser) => {

        return this.queryUtils.extractPermittedQueryIdsByDataPermissions(
          parser, dataPermissions
        ).andThen((permittedQueryIds) => {
      
          const expectedCompensationIds = 
            this.queryUtils.getCompensationIdsByPermittedQueryIds(parser, permittedQueryIds)
    
          const expectedRewardList = 
            this.compensationIdsToExpectedRewards(expectedCompensationIds);
    
            return okAsync<[QueryIdentifier[], ExpectedReward[]]>(
              [permittedQueryIds.map(QueryIdentifier), expectedRewardList]
            );
          });

      });
  }

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
    parameters?: IDynamicRewardParameter[],
  ): ResultAsync<
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    const rewards: EligibleReward[] = [];
    const schemaString = query.query;
    const cid: IpfsCID = query.cid;

    return this.queryFactories
      .makeParserAsync(cid, schemaString)
      .andThen((sdqlParser) => {
        return sdqlParser.buildAST();
      })
      .andThen((ast: AST) => {
        const astEvaluator = this.queryFactories.makeAstEvaluator(
          cid,
          ast,
          this.queryRepository,
        );

        return ResultUtils.combine(
          this.evalReturns(ast, dataPermissions, astEvaluator),
        ).andThen((insightResults) => {
          const insights = insightResults.map(this.SDQLReturnToInsightString);

          return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>(
            [insights, rewards],
          );
        });
      });
  }

  protected compensationIdsToExpectedRewards(
    compensationIds: CompensationId[]
  ): ExpectedReward[] {
      return compensationIds.map((c) => new ExpectedReward(c));
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

  private evalReturns(
    ast: AST,
    dataPermissions: DataPermissions,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<SDQL_Return, EvaluationError>[] {
    return [...ast.logic.returns.keys()].map((returnStr) => {
      const requiredPermissions = ast.logic.getReturnPermissions(returnStr);

      if (dataPermissions.contains(requiredPermissions)) {
        return astEvaluator.evalAny(ast.logic.returns.get(returnStr));
      } else {
        return okAsync(SDQL_Return(null));
      }
    });
  }
}
