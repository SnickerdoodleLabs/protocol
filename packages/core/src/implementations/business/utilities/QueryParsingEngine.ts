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
//import { SnickerdoodleCore } from "@snickerdoodlelabs/core";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  protected insightsMap: Insight[] = [];
  protected rewardsMap: EligibleReward[] = [];

  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
    @inject(IQueryFactoriesType)
    protected queryFactories: IQueryFactories,
    @inject(IQueryRepositoryType)
    protected queryRepository: IQueryRepository
  ) {
    this.insightsMap = [];
    this.rewardsMap = [];
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

  public handleQuery(query: SDQLQuery): ResultAsync<[Insight[], EligibleReward[]], never | QueryFormatError> {

    const schemaString = query.query;
    // const schema = new SDQLSchema(query.query);
    const cid: IpfsCID = query.cid;

    const sdqlParser = this.queryFactories.makeParser(cid, schemaString);
    const ast = sdqlParser.buildAST();

    const astEvaluator = this.queryFactories.makeAstEvaluator(cid, ast, this.queryRepository)

    

    return okAsync([this.insightsMap, this.rewardsMap]);

  }
  
}