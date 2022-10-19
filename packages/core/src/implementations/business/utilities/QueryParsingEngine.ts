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

  /* ENGT-745
    Return these schematics: 
    1. The data types that we are asking for: (Location, Age, Web3 data, etc.)
    2. Return the current values assigned to each data type (true, false, false, true)
    3. Display which rewards will be given because of your associated values 
  */
  public getRewardsPreview (
    query: SDQLQuery
  ): ResultAsync<
  EligibleReward[],
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
      )
      return ResultUtils.combine(
        this.evalCompensations(ast, astEvaluator),
      ).andThen((CompensationResults) => {
        
        console.log("CompensationResults: ", CompensationResults);
        const rewardsPreviews = CompensationResults.map(this.SDQLReturnToInsightString);
        console.log("CompensationResults: ", rewardsPreviews);

        return okAsync<EligibleReward[], QueryFormatError>(rewards);
    });
  });


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
          // console.log('insightResults', insightResults);

          const insights = insightResults.map(this.SDQLReturnToInsightString);
          // console.log("Insights: ", insights)

          return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>(
            [insights, rewards],
          );
        });

        // return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>([insights, rewards]);
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



  private evalCompensations(
    ast: AST,
    astEvaluator: AST_Evaluator,
  ): ResultAsync<SDQL_Return, EvaluationError>[] {
    return [...ast.logic.compensations.keys()].map((compStr) => {
      
      console.log("ast.logic.compensations.get(compStr)", ast.logic.compensations.get(compStr));
      const returnedval = astEvaluator.evalCompensationExpr(ast.logic.compensations.get(compStr));

      console.log("Eval Any Comp Value: ", returnedval)
      return returnedval;
      });
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
