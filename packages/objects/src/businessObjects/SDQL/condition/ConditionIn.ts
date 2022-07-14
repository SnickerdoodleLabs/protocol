import { CountryCode, SDQL_OperatorName } from "@objects/primitives";
import { Condition } from "./Condition";
import { IDataWalletPersistence } from "@objects/interfaces";
import { PersistenceError } from "@objects/errors";
import { errAsync, okAsync } from "neverthrow";
import { ResultAsync } from "neverthrow";
import { AST } from "prettier";
import { AST_Expr } from "../AST_Expr";

export class ConditionIn extends Condition {

    constructor(
        name: SDQL_OperatorName,
        readonly vals: Array<number> | AST_Expr,
        protected persistenceRepo: IDataWalletPersistence

    ) {
        super(name);
    }

    // public result(): ResultAsync<boolean, PersistenceError>{
    //     let repoLoc: CountryCode = CountryCode(1);
    //     this.persistenceRepo.getLocation().map( () => (repoLoc))
    //     if (repoLoc == null){
    //         return errAsync(new PersistenceError("Bad Variable"));
    //     }
    //     for (let i = 0; i < this.vals.length; i++){
    //         if (this.vals[i] == repoLoc) {
    //             return okAsync(true);
    //         } 
    //     }
    //     return okAsync(false);
    // }
}