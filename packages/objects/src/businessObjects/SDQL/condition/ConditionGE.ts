import { Age, SDQL_OperatorName } from "@objects/primitives";
import { Operator } from "../Operator";
import { IDataWalletPersistence } from "@objects/interfaces";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { PersistenceError } from "@objects/errors";
import { AST_Expr } from "../AST_Expr";

export class ConditionGE extends Operator {

    constructor(
        name: SDQL_OperatorName, // ge - greater and equal then
        readonly rval: number | AST_Expr,
        // protected persistenceRepo: IDataWalletPersistence
    ) {
        super(name);
    }

    // public result(): ResultAsync<boolean, PersistenceError>{

    //     // check if rval is a primitive.
    //     let repoAge: Age = Age(100);
    //     this.persistenceRepo.getAge().map( () => (repoAge))
    //     if (repoAge == null){
    //         return errAsync(new PersistenceError("Bad Variable"));
    //     }
        
    //     return okAsync(repoAge >= this.rval);
    //     //return okAsync(false);
    // }
}