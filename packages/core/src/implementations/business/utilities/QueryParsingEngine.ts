import {
  DataPermissions, EligibleReward, EvaluationError, IpfsCID, QueryFormatError, SDQLQuery,
  SDQL_Return
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/AST_Evaluator";
import {
  IQueryParsingEngine,
  IQueryRepository,
  IQueryRepositoryType
} from "@core/interfaces/business/utilities";
import { AST, InsightString } from "@core/interfaces/objects";
import {
  IQueryFactories,
  IQueryFactoriesType
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

    // console.log('QueryParsingEngine.handleQuery');

    const insights: Array<InsightString> = [];
    const rewards: EligibleReward[] = [];

    const schemaString = query.query;
    
    const cid: IpfsCID = query.cid;

    // console.log('QueryParsingEngine.handleQuery schemaString', schemaString);

    const sdqlParser = this.queryFactories.makeParser(cid, schemaString);
    // const ast = sdqlParser.buildAST();
    return sdqlParser.buildAST().andThen((ast:AST) => {

      console.log('QueryParsingEngine.handleQuery evaluating');

      const astEvaluator = this.queryFactories.makeAstEvaluator(
        cid,
        ast,
        this.queryRepository,
      );
      
  
      const insight_results: ResultAsync<SDQL_Return, EvaluationError>[] = this.evalReturns(ast, dataPermissions, astEvaluator);
  
      // const comp_results: ResultAsync<SDQL_Return, EvaluationError>[] = this.evalCompensations(ast, dataPermissions, astEvaluator);

      console.log(insight_results);
    
      return ResultUtils.combine(insight_results).andThen((insighResults) => {
        console.log(insighResults);
  
        for (const sdqlR of insighResults) {
          insights.push(InsightString(sdqlR as string));
        }
  
        console.log('QueryParsingEngine.handleQuery returning results');

        return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>([
          insights,
          rewards,
        ]);
      })
      // .mapErr((err) => {
      //   console.log("QueryParsingEngine.handleQuery error", err);
      //   return new EvaluationError("Error resolving results");
      //   // return errAsync(err as EvaluationError | QueryFormatError);
      // });
    })

  }

  private evalCompensations(ast: AST, dataPermissions: DataPermissions, astEvaluator: AST_Evaluator): ResultAsync<SDQL_Return, EvaluationError>[] {

    return [...ast.logic.compensations.keys()].map((compStr) => {

        const requiredPermissions = ast.logic.getCompensationPermissions(compStr);
        if (dataPermissions.contains(requiredPermissions)) {
  
          return astEvaluator.evalAny(ast.logic.compensations.get(compStr));
  
        } else {

          return okAsync(SDQL_Return(null));

        }

    });

  }

  private evalReturns(ast: AST, dataPermissions: DataPermissions, astEvaluator: AST_Evaluator): ResultAsync<SDQL_Return, EvaluationError>[] {


      return [...ast.logic.returns.keys()].map((returnStr) => {

        const requiredPermissions = ast.logic.getReturnPermissions(returnStr);
        console.log(requiredPermissions);
        if (dataPermissions.contains(requiredPermissions)) {
  
          return astEvaluator.evalAny(ast.logic.returns.get(returnStr));
  
        } else {

          return okAsync(SDQL_Return(null));

        }

    });
    
  }
}
