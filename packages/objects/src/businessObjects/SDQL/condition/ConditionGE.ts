import { Age, SDQL_OperatorName } from "@objects/primitives";
import { Condition } from "./Condition";
import { IDataWalletPersistence } from "@objects/interfaces";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { PersistenceError } from "@objects/errors";


export class ConditionGE extends Condition {

    constructor(
        name: SDQL_OperatorName, // ge - greater and equal then
        readonly rval: number,
        protected persistenceRepo: IDataWalletPersistence
    ) {
        super(name);
    }

    public result(): ResultAsync<boolean, PersistenceError>{
        let repoAge: Age = Age(100);
        this.persistenceRepo.getAge().map( () => (repoAge))
        if (repoAge == null){
            return errAsync(new PersistenceError("Bad Variable"));
        }
        
        return okAsync(repoAge >= this.rval);
        //return okAsync(false);
    }
}