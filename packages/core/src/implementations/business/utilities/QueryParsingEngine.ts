import {
  EvaluationError,
  QueryFormatError,
  EligibleReward,
  IpfsCID,
  SDQLQuery,
  SDQL_Return,
  URLString,
  DataPermissions,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError
  > {
    const insights: Array<InsightString> = [];
    const rewards: EligibleReward[] = [];

    const schemaString = query.query;
    
    const cid: IpfsCID = query.cid;

    const sdqlParser = this.queryFactories.makeParser(cid, schemaString);
    // const ast = sdqlParser.buildAST();
    return sdqlParser.buildAST().andThen((ast:AST) => {

      const astEvaluator = this.queryFactories.makeAstEvaluator(
        cid,
        ast,
        this.queryRepository,
      );
      
  
      const insight_results: ResultAsync<SDQL_Return, EvaluationError>[] = [];
      const comp_results: ResultAsync<SDQL_Return, EvaluationError>[] = [];
  
      for (const returnStr of ast.logic.returns.keys()) {
        
        const result = astEvaluator.evalAny(ast.logic.returns.get(returnStr));
        insight_results.push(result);
  
      }
  
      for (const compStr of ast.logic.compensations.keys()) {
        
        const result = astEvaluator.evalAny(ast.logic.compensations.get(compStr));
        comp_results.push(result);
        
      }
  
      const resultList = [insight_results, comp_results];
  
      return ResultUtils.combine(insight_results).andThen((insighResults) => {
        // console.log(insighResults);
  
        for (const sdqlR of insighResults) {
          insights.push(InsightString(sdqlR as string));
        }
        /*
        for (const sdqlR of insighResults) {
          rewards.push(new EligibleReward(sdqlR as string, URLString(sdqlR as string)));
        }
        */
  
        return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>([
          insights,
          rewards,
        ]);
      });
    })

  }
}
