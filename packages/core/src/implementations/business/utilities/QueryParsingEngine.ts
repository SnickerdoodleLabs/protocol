import {
  DataPermissions,
  EligibleReward,
  EvaluationError,
  IpfsCID,
  QueryFormatError,
  SDQLQuery,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/AST_Evaluator";
import {
  IQueryParsingEngine,
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities";
import { AST, InsightString } from "@core/interfaces/objects";
import {
  IQueryFactories,
  IQueryFactoriesType,
} from "@core/interfaces/utilities/factory";

//import { SnickerdoodleCore } from "@snickerdoodlelabs/core";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  public constructor(
    // @inject(IDataWalletPersistenceType)
    // protected persistenceRepo: IDataWalletPersistence,
    @inject(IQueryFactoriesType)
    protected queryFactories: IQueryFactories,
    @inject(IQueryRepositoryType)
    protected queryRepository: IQueryRepository,
  ) {}

  /**
   * public handleQuery(cid, schemaString): {"returns":
   *                                                {"orignalExp": value, "$r3": vallue},
   *                                         "compensations":{}...
   *                                        }
   * {
   * 1. create the SDQLParser and ast
   * 2. iterate over ast.logic.returns and evaluate every returnAST (astEvaluator.evalAny(returnAST))
   * 3. iterate over ast.logic.compensations and evaluate every compensationAST.
   * }
   */

  public handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    [InsightString[], EligibleReward[]] | never,
    EvaluationError | QueryFormatError
  > {
    console.log("QueryParsingEngine.handleQuery");

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
          console.log(insightResults);

          const insights = insightResults.map((sdqlR) => {
            return InsightString(sdqlR as string);
          });

          return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>(
            [insights, rewards],
          );
        });

        // return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>([insights, rewards]);
      });
  }

  private evalCompensations(
    ast: AST,
    dataPermissions: DataPermissions,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<SDQL_Return, EvaluationError>[] {
    return [...ast.logic.compensations.keys()].map((compStr) => {
      const requiredPermissions = ast.logic.getCompensationPermissions(compStr);
      if (dataPermissions.contains(requiredPermissions)) {
        return astEvaluator.evalAny(ast.logic.compensations.get(compStr));
      } else {
        return okAsync(SDQL_Return(null));
      }
    });
  }

  private evalReturns(
    ast: AST,
    dataPermissions: DataPermissions,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<SDQL_Return, EvaluationError>[] {
    return [...ast.logic.returns.keys()].map((returnStr) => {
      const requiredPermissions = ast.logic.getReturnPermissions(returnStr);
      // console.log(requiredPermissions);
      if (dataPermissions.contains(requiredPermissions)) {
        return astEvaluator.evalAny(ast.logic.returns.get(returnStr));
      } else {
        return okAsync(SDQL_Return(null));
      }
    });
  }
}
