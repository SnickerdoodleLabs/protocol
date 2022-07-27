import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  Insight, QueryFormatError
} from "@snickerdoodlelabs/objects";

import { EligibleReward } from "@snickerdoodlelabs/objects";

import { IQueryParsingEngine, IQueryRepository, IQueryRepositoryType } from "@core/interfaces/business/utilities";
import { IQueryFactories, IQueryFactoriesType } from "@core/interfaces/utilities/factory";
import { IpfsCID, SDQLQuery, SDQLSchema } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { InsightString } from "@core/interfaces/objects";
import { SDQL_Return } from "@snickerdoodlelabs/objects";
//import { SnickerdoodleCore } from "@snickerdoodlelabs/core";


@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  

  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
    @inject(IQueryFactoriesType)
    protected queryFactories: IQueryFactories,
    @inject(IQueryRepositoryType)
    protected queryRepository: IQueryRepository
  ) {
  }

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

  public handleQuery(query: SDQLQuery): ResultAsync<[InsightString[], EligibleReward[]], never | QueryFormatError> {

    const insights: Array<InsightString> = [];
    const insightMap: Map<string, SDQL_Return> = new Map();
    const rewards: EligibleReward[] = [];

    const schemaString = query.query;
    // const schema = new SDQLSchema(query.query);
    const cid: IpfsCID = query.cid;

    const sdqlParser = this.queryFactories.makeParser(cid, schemaString);
    const logicSchema = sdqlParser.schema.getLogicSchema();
    const ast = sdqlParser.buildAST();

    const astEvaluator = this.queryFactories.makeAstEvaluator(cid, ast, this.queryRepository)

    for (const returnStr in ast.logic.returns) {

      const result = astEvaluator.evalAny(ast.logic.returns[returnStr]);
      result.then((res2) =>{
        if (res2.isOk()) {
          insightMap.set(returnStr, res2.value);
        } else {
          
          insightMap.set(returnStr, SDQL_Return(""));
        }
      });
    }

    for (let returnStr of logicSchema["returns"]) {
      const obj = insightMap.get(returnStr);
      if (obj) {
        
        insights.push(InsightString(JSON.stringify(obj)));

      } else {

        insights.push(InsightString(""));

      }
    }


    // logicSchema["returns"].reduce() // reduce will destroy ordering because function is called asynchronously?
    

    return okAsync([insights, rewards]);

  }
  
}