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
  SDQL_Name,
  MissingASTError
} from "@snickerdoodlelabs/objects";
import { AST } from "@snickerdoodlelabs/query-parser";
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
import { AST_Query } from "@snickerdoodlelabs/query-parser";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  public constructor(
    @inject(IQueryFactoriesType)
    protected queryFactories: IQueryFactories,
    @inject(IQueryRepositoryType)
    protected queryRepository: IQueryRepository,
  ) {}

  public getPreviews (
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
  [SDQL_Return[], SDQL_Return[]],
  EvaluationError | QueryFormatError | QueryExpiredError
> {

  const rewards: ExpectedReward[] = [];
  const schemaString = query.query;
  const cid: IpfsCID = query.cid;

  return this.queryFactories
    .makeParserAsync(cid, schemaString)
    .andThen((sdqlParser) => {
        return sdqlParser.buildAST();
    })
    .andThen((ast: AST) => {
      const astTree = ast;
      const astEvaluator = this.queryFactories.makeAstEvaluator(
        cid,
        ast,
        this.queryRepository,
      )

      // return okAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError | QueryFormatError | QueryExpiredError>([[], []]);

      return ResultUtils.combine([
        this.identifyQueries(astTree, astEvaluator, dataPermissions),
        this.evalCompensations(astTree, astEvaluator, dataPermissions),
      ])
      .andThen((val) => {
        return okAsync(val);
      })
    // .andThen(([queries, compensations])=> {
    //   return okAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError | QueryFormatError | QueryExpiredError>([[], []]);
    //   // return okAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError | QueryFormatError | QueryExpiredError>([queries, compensations]);
    // })
    })      
  }

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError | QueryExpiredError
  > {
    // console.log("QueryParsingEngine.handleQuery");

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

  public evalCompensations(
    ast: AST,
    astEvaluator: AST_Evaluator,
    dataPermissions: DataPermissions
  ): ResultAsync<SDQL_Return[], EvaluationError> {
    const result = [...ast.logic.compensations.keys()].map((compStr) => {      
      const returnedval = astEvaluator.evalCompensationExpr(ast.logic.compensations.get(compStr));
      return returnedval;
    });

    return ResultUtils.combine(result);
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

  public identifyQueries(
    ast: AST,
    astEvaluator: AST_Evaluator,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return[], EvaluationError> {
    const results = [...ast.logic.returns.keys()].map((returnStr) => {

      const requiredPermissions = ast.logic.getReturnPermissions(returnStr);

      if (dataPermissions.contains(requiredPermissions)) {
        return astEvaluator.evalAny(ast.logic.returns.get(returnStr));
      } else {
        return okAsync(SDQL_Return(null));
      }
    });

    return ResultUtils.combine(results);
  }
}