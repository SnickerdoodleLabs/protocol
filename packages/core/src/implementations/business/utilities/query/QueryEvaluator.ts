import {
  Age,
  CountryCode,
  EvalNotImplementedError,
  Gender,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_BalanceQuery,
  AST_Expr,
  AST_Web3Query,
  AST_PropertyQuery,
  AST_Query,
  Condition,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
  AST_BlockchainTransactionQuery,
  AST_NftQuery,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IProfileService,
  IProfileServiceType,
} from "@core/interfaces/business/IProfileService.js";
import {
  IBlockchainTransactionQueryEvaluator,
  IBlockchainTransactionQueryEvaluatorType,
  INftQueryEvaluator,
  INftQueryEvaluatorType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IBalanceQueryEvaluator,
  IBalanceQueryEvaluatorType,
} from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator.js";
import { IQueryEvaluator } from "@core/interfaces/business/utilities/query/IQueryEvaluator.js";
import {
  IBrowsingDataRepository,
  IBrowsingDataRepositoryType,
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
  IDemographicDataRepository,
  IDemographicDataRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class QueryEvaluator implements IQueryEvaluator {
  constructor(
    @inject(IBalanceQueryEvaluatorType)
    protected balanceQueryEvaluator: IBalanceQueryEvaluator,
    @inject(IBlockchainTransactionQueryEvaluatorType)
    protected blockchainTransactionQueryEvaluator: IBlockchainTransactionQueryEvaluator,
    @inject(INftQueryEvaluatorType)
    protected nftQueryEvaluator: INftQueryEvaluator,
    @inject(IProfileServiceType)
    protected profileService: IProfileService,
    @inject(IDemographicDataRepositoryType)
    protected demographicDataRepo: IDemographicDataRepository,
    @inject(IBrowsingDataRepositoryType)
    protected browsingDataRepo: IBrowsingDataRepository,
    @inject(ITransactionHistoryRepositoryType)
    protected transactionRepo: ITransactionHistoryRepository,
  ) {}

  protected age: Age = Age(0);
  protected location: CountryCode = CountryCode("12345");

  public eval<T extends AST_Query>(
    query: T,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    if (query instanceof AST_BlockchainTransactionQuery) {
      return this.blockchainTransactionQueryEvaluator.eval(query);
    } else if (query instanceof AST_BalanceQuery) {
      return this.balanceQueryEvaluator.eval(query);
    } else if (query instanceof AST_NftQuery) {
      return this.nftQueryEvaluator.eval(query);
    } else if (query instanceof AST_PropertyQuery) {
      return this.evalPropertyQuery(query);
    }

    return errAsync(
      new PersistenceError(
        `Unknown query type in QueryEvaluator.eval, ${query.name}`,
      ),
    );
  }

  public evalPropertyQuery(
    q: AST_PropertyQuery,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    let result = SDQL_Return(true);
    switch (q.property) {
      case "age":
        return this.profileService.getAge().andThen((age) => {
          switch (q.returnType) {
            case "boolean":
              for (const condition of q.conditions) {
                result = result && this.evalPropertyConditon(age, condition);
              }
              return okAsync(result);
            case "integer":
              result = SDQL_Return(age);
              return okAsync(result);
            default:
              return okAsync(result);
          }
        });
      case "location":
        return this.demographicDataRepo.getLocation().andThen((location) => {
          switch (q.returnType) {
            case "string":
              result = SDQL_Return(location);
              return okAsync(result);
            case "boolean":
              for (const condition of q.conditions) {
                result =
                  result && this.evalPropertyConditon(location, condition);
              }
              return okAsync(result);
            case "integer":
              result = SDQL_Return(location);
              return okAsync(result);
            default:
              return okAsync(result);
          }
        });
      case "gender":
        return this.demographicDataRepo.getGender().andThen((gender) => {
          switch (q.returnType) {
            case "enum":
              if(q.enum_keys){
                for (const key of q.enum_keys) {
                  if (key == gender) {
                    return okAsync(SDQL_Return(gender));
                  }
                }
              }
              return okAsync(SDQL_Return(Gender("unknown")));
            default:
              return okAsync(result);
          }
        });
      case "url_visited_count":
        return this.browsingDataRepo
          .getSiteVisitsMap(q.timestampRange)
          .andThen((url_visited_count) => {
            return okAsync(SDQL_Return(url_visited_count));
          });
      case "chain_transactions":
        return this.transactionRepo
          .getTransactionValueByChain()
          .andThen((transactionArray) => {
            return okAsync(SDQL_Return(transactionArray));
          });
      default:
        return okAsync(result);
    }
  }

  public evalPropertyConditon(
    propertyVal: Age | CountryCode | null,
    condition: Condition,
  ): SDQL_Return {
    if (propertyVal == null) {
      // const err = new Error("In evalPropertyConditon, propertyVal is null!");
      // console.error(err);
      // throw err;
      return SDQL_Return(null);
    }
    //console.log(`Evaluating property condition ${condition} against ${propertyVal}`);
    let val: number | AST_Expr = 0;
    if (condition instanceof ConditionGE) {
      val = condition.rval;
      //console.log("PropertyVal is: ", propertyVal);
      //console.log("Val is: ", val);
      //console.log("Return should be: ", propertyVal >= val);
      return SDQL_Return(propertyVal >= val);
      //return okAsync(SDQL_Return(propertyVal >= val));
    } else if (condition instanceof ConditionG) {
      val = condition.rval;
      //console.log("PropertyVal is: ", propertyVal);
      //console.log("Val is: ", val);
      //console.log("Return should be: ", propertyVal > val);
      return SDQL_Return(propertyVal > val);
      //return okAsync(SDQL_Return(propertyVal > val));
    } else if (condition instanceof ConditionL) {
      val = condition.rval;
      // console.log("PropertyVal is: ", propertyVal);
      // console.log("Val is: ", val);
      // console.log("Return should be: ", propertyVal < val);
      return SDQL_Return(propertyVal < val);
      //return okAsync(SDQL_Return(propertyVal < val));
    } else if (condition instanceof ConditionE) {
      val = condition.rval;
      //console.log("PropertyVal is: ", propertyVal);
      //console.log("Val is: ", val);
      //console.log("Return should be: ", propertyVal == val);
      return SDQL_Return(propertyVal == val);
      //return okAsync(SDQL_Return(propertyVal == val));
    } else if (condition instanceof ConditionLE) {
      val = condition.rval;
      return SDQL_Return(propertyVal <= val);
      //return okAsync(SDQL_Return(propertyVal <= val));
    } else if (condition instanceof ConditionIn) {
      // console.log("In Condition IN");
      const find_val = condition.lval;
      // console.log("Looking for: ", find_val);
      const in_values = condition.rvals;
      // console.log("Within: ", in_values);
      for (let i = 0; i < in_values.length; i++) {
        if (find_val == in_values[i]) {
          // console.log("Found: ", find_val);
          return SDQL_Return(true);
          //return okAsync(SDQL_Return(true));
        }
      }
      // console.log("Did not Find: ", find_val);
      return SDQL_Return(false);
      //return okAsync(SDQL_Return(false));
    }

    console.error(`EvalNotImplementedError ${condition.constructor.name}`);
    throw new EvalNotImplementedError(condition.constructor.name);
  }
}
