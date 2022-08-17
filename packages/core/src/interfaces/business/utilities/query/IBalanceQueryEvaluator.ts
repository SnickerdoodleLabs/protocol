import { AST_NetworkQuery, AST_PropertyQuery, Condition } from "@core/interfaces/objects";
import { IEVMBalance, PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBalanceQueryEvaluator {
    evalConditions(
        conditions: Array<Condition>,
        balanceArray: IEVMBalance[]
    ): SDQL_Return;
}

export const IBalanceQueryEvaluatorType = Symbol.for("IBalanceQueryEvaluator");