import {
  Age,
  CountryCode,
  EvalNotImplementedError,
  Gender,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  PersistenceError,
  SDQL_Return,
  UnixTimestamp,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import {
  AST_BalanceQuery,
  AST_Expr,
  AST_NetworkQuery,
  AST_NFTS,
  AST_PropertyQuery,
  AST_Query,
  Condition,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IProfileService,
  IProfileServiceType,
} from "@core/interfaces/business/IProfileService.js";
import {
  IBalanceQueryEvaluator,
  IBalanceQueryEvaluatorType,
} from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator.js";
import {
  INetworkQueryEvaluator,
  INetworkQueryEvaluatorType,
} from "@core/interfaces/business/utilities/query/INetworkQueryEvaluator.js";
import { IQueryEvaluator } from "@core/interfaces/business/utilities/query/IQueryEvaluator.js";

@injectable()
export class QueryEvaluator implements IQueryEvaluator {
  constructor(
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IBalanceQueryEvaluatorType)
    protected balanceQueryEvaluator: IBalanceQueryEvaluator,
    @inject(INetworkQueryEvaluatorType)
    protected networkQueryEvaluator: INetworkQueryEvaluator,
    @inject(IProfileServiceType)
    protected profileService: IProfileService,
  ) {}

  protected age: Age = Age(0);
  protected location: CountryCode = CountryCode("12345");

  public eval<T extends AST_Query>(
    query: T,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    
    if (query instanceof AST_NetworkQuery) {
      return this.networkQueryEvaluator.eval(query);
    } else if (query instanceof AST_BalanceQuery) {
      return this.balanceQueryEvaluator.eval(query);
    } else if (query instanceof AST_PropertyQuery) {
      return this.evalPropertyQuery(query);
    } else if (query instanceof AST_NFTS){
    
      return  this.dataWalletPersistence.getAccountNFTs().andThen( (nfts) => {
        return okAsync(SDQL_Return(nfts))
      })
    }

    return errAsync(
      new PersistenceError(
        `Unknown query type in QueryEvaluator.eval, ${query.name}`,
      ),
    );
  }

  public evalPropertyQuery(
    q: AST_PropertyQuery 
  ): ResultAsync<SDQL_Return  , PersistenceError> {
    console.log(" evalPropertyQuery  ");

    let result = SDQL_Return(true);
    switch (q.property) {
      case "age":
        return this.profileService.getAge().andThen((age) => {
          console.log(" getBirthday  ", age);

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
        return this.dataWalletPersistence.getLocation().andThen((location) => {
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
        return this.dataWalletPersistence.getGender().andThen((gender) => {
          switch (q.returnType) {
            case "enum":
              for (const key of q.enum_keys) {
                if (key == gender) {
                  return okAsync(SDQL_Return(gender));
                }
              }
              return okAsync(SDQL_Return(Gender("unknown")));
            default:
              return okAsync(result);
          }
        });
      case "url_visited_count":
        return this.dataWalletPersistence
          .getSiteVisitsMap()
          .andThen((url_visited_count) => {
            return okAsync(SDQL_Return(url_visited_count));
          });
      case "chain_transactions":
        return this.dataWalletPersistence
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
