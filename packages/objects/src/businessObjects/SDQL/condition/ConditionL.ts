import { Age, SDQL_OperatorName } from "@objects/primitives";
import { Operator } from "../Operator";
import { IDataWalletPersistence } from "@objects/interfaces";
import { PersistenceError } from "@objects/errors";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { AST_Expr } from "../AST_Expr";

export class ConditionL extends Operator {

    constructor(
        name: SDQL_OperatorName,
        readonly rval: number | AST_Expr,
        //protected persistenceRepo: IDataWalletPersistence
    ) {
        super(name);
    }

    // public result(): ResultAsync<boolean, PersistenceError>{
    //     let repoAge: Age = Age(100);
    //     this.persistenceRepo.getAge().map( () => (repoAge))
    //     if (repoAge == null){
    //         return errAsync(new PersistenceError("Bad Variable"));
    //     }
    //     return okAsync(repoAge < this.rval);
    // }
}