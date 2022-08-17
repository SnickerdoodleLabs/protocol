import {
    Age,
    ConsentConditions,
    CountryCode, EvalNotImplementedError, Gender,
    IDataWalletPersistence, IDataWalletPersistenceType,
    IEVMBalance,
    PersistenceError, SDQL_Return
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IQueryEvaluator } from "@core/interfaces/business/utilities";
import {
    AST_BalanceQuery, 
    AST_Expr,
    Condition, 
    ConditionE, 
    ConditionG, 
    ConditionGE,
    ConditionIn,
    ConditionL,
    ConditionLE
} from "@core/interfaces/objects";
import { EVMAccountAddress, EVMTransactionFilter } from "@snickerdoodlelabs/objects";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";

@injectable()
export class BalanceQueryEvaluator implements IBalanceQueryEvaluator {
    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence,
    ) {}

    protected age: Age = Age(0);
    protected location: CountryCode = CountryCode("12345");

    public evalConditions(
        query: AST_BalanceQuery
    ): ResultAsync<SDQL_Return, PersistenceError> {

        return this.dataWalletPersistence.getAccountBalances().andThen( (balances) => {
            console.log("balances 1: ", balances);
            if (query.networkId == null){
                return okAsync((balances));
            }
            return okAsync((balances.filter((balance) => balance.chainId == query.networkId)));
          }
        ).andThen( (balanceArray) => {

            for (let i = 0; i < query.conditions.length; i++){
                let condition = query.conditions[i]
                console.log("Condition: ", condition);
                console.log("balanceArray: ", balanceArray);
                let val: number | AST_Expr = 0;
                switch (condition.constructor) {
                    case ConditionGE:
                        val = (condition as ConditionGE).rval;
                        balanceArray = balanceArray.filter((balance) => parseFloat(balance.balance) >= val);
                        break;
                    case ConditionG:
                        val = (condition as ConditionG).rval;
                        balanceArray = balanceArray.filter((balance) => parseFloat(balance.balance) > val);
                        break;
                    case ConditionL:
                        val = (condition as ConditionL).rval;
                        balanceArray = balanceArray.filter((balance) => parseFloat(balance.balance) < val);
                        break;
                    case ConditionE:
                        val = (condition as ConditionE).rval;
                        balanceArray = balanceArray.filter((balance) => parseFloat(balance.balance) == val);
                        break;
                    case ConditionLE:
                        val = (condition as ConditionLE).rval;
                        balanceArray = balanceArray.filter((balance) => parseFloat(balance.balance) <= val);
                        break;
    
                    default:
                        throw new EvalNotImplementedError(condition.constructor.name);
                }
            }
            return okAsync(SDQL_Return(balanceArray));
        })
    }
}
