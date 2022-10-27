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
  URLString,
  ERewardType
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
    @inject(IQueryFactoriesType)
    protected queryFactories: IQueryFactories,
    @inject(IQueryRepositoryType)
    protected queryRepository: IQueryRepository,
  ) {}

  public getPreviews (
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
  [QueryIdentifier[], ExpectedReward[]],
  EvaluationError | QueryFormatError | QueryExpiredError
> {

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

      return ResultUtils.combine([
        this.identifyQueries(astTree, astEvaluator, dataPermissions),
        this.evalCompensations(astTree, astEvaluator, dataPermissions),
      ])
      .andThen((results) => {
        const queries = results[0];
        const compensations = results[1];
        const queryIdentifiers = queries.map(this.SDQLReturnToQueryIdentifier).filter((n) => n);
        const expectedRewards = compensations.filter((n) => n).map(this.SDQLReturnToExpectedReward);
        return okAsync<[QueryIdentifier[], ExpectedReward[]], EvaluationError | QueryFormatError | QueryExpiredError>([queryIdentifiers, expectedRewards]);
      })
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

  protected SDQLReturnToQueryIdentifier(sdqlR: SDQL_Return): QueryIdentifier {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;
    if (typeof actualTypeData == "string") {
      return QueryIdentifier(actualTypeData);
    } else if (actualTypeData == null) {
      return QueryIdentifier("");
    } else {
      return QueryIdentifier(JSON.stringify(actualTypeData));
    }
  }

  // TODO: Add Lazy and Web2 Reward Implementation
  protected SDQLReturnToExpectedReward(sdqlR: SDQL_Return): ExpectedReward {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;
    if (typeof actualTypeData == "object") {
      if (actualTypeData != null){
        return new ExpectedReward(actualTypeData["description"], URLString(actualTypeData["callback"]), ERewardType.Direct);
      }
    }
    if (typeof actualTypeData == "string"){
      const rewardData = JSON.parse(actualTypeData);
      return new ExpectedReward(rewardData["description"], URLString(rewardData["callback"]), ERewardType.Direct);
    }
    return new ExpectedReward("", URLString(""), ERewardType.Direct);
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

    console.log("evalCompensations: ", result);


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
    const result = [...ast.logic.compensations.keys()].map((compStr) => {    
      console.log("compStr: ", compStr);  
      const returnedval = astEvaluator.evalQueryExpr(ast.logic.compensations.get(compStr));
      console.log("returnedval: ", returnedval);  

      return returnedval;
    });

    console.log("identifyQueries: ", result);

    return ResultUtils.combine(result);
  }
}