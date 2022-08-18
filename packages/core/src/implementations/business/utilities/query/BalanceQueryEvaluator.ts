import { EvalNotImplementedError, IDataWalletPersistence, IDataWalletPersistenceType, IEVMBalance, PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import {
    AST_BalanceQuery,
    AST_Expr, ConditionE,
    ConditionG,
    ConditionGE, ConditionL,
    ConditionLE
} from "@core/interfaces/objects";

@injectable()
export class BalanceQueryEvaluator implements IBalanceQueryEvaluator {
    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence,
    ) {}

    public eval(
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

            balanceArray = this.evalConditions(query, balanceArray);
            return okAsync(SDQL_Return(balanceArray));
        })
    }


    public evalConditions(query: AST_BalanceQuery, balanceArray: IEVMBalance[]) {

        for (let condition of query.conditions) {
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

        return balanceArray;
    }
    // public evalConditions()
}
