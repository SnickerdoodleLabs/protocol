import {
  EvaluationError,
  QueryFormatError,
  EligibleReward,
  IpfsCID,
  SDQLQuery,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IQueryParsingEngine,
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities";
import { InsightString } from "@core/interfaces/objects";
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
  ): ResultAsync<
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError
  > {
    const insights: Array<InsightString> = [];
    const insightMap: Map<string, SDQL_Return | string> = new Map();
    const rewards: EligibleReward[] = [];

    const schemaString = query.query;
    // const schema = new SDQLSchema(query.query);
    const cid: IpfsCID = query.cid;

    const sdqlParser = this.queryFactories.makeParser(cid, schemaString);
    const logicSchema = sdqlParser.schema.getLogicSchema();
    const ast = sdqlParser.buildAST();

    const astEvaluator = this.queryFactories.makeAstEvaluator(
      cid,
      ast,
      this.queryRepository,
    );
    // console.log("line 59", "made ast and evaluator");

    const results: ResultAsync<SDQL_Return, EvaluationError>[] = [];

    for (const returnStr of ast.logic.returns.keys()) {
      // console.log("line 62", returnStr);
      const result = astEvaluator.evalAny(ast.logic.returns.get(returnStr));

      // console.log(result);
      results.push(result);
    }

    return ResultUtils.combine(results).andThen((insighResults) => {
      // console.log(insighResults);

      for (const sdqlR of insighResults) {
        insights.push(InsightString(sdqlR as string));
      }
      return okAsync<[InsightString[], EligibleReward[]], QueryFormatError>([
        insights,
        rewards,
      ]);
    });
  }
}
