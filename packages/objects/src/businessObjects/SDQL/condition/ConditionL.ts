import { Age, SDQL_OperatorName } from "@objects/primitives";
import { Condition } from "./Condition";
import { IDataWalletPersistence } from "@objects/interfaces";
import { PersistenceError } from "@objects/errors";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export class ConditionL extends Condition {

    constructor(
        name: SDQL_OperatorName,
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
        return okAsync(repoAge < this.rval);
    }
}