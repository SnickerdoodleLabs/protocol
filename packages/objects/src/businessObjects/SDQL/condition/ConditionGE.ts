import { SDQL_OperatorName } from "@objects/primitives";
import { Condition } from "./Condition";
import { IDataWalletPersistence } from "@browser-extension/interfaces";

export class ConditionGE extends Condition {

    constructor(
        name: SDQL_OperatorName, // ge - greater and equal then
        readonly rval: number,
        protected persistenceRepo: IDataWalletPersistence
    ) {
        super(name);
    }

    public result(): boolean{
        return (this.persistenceRepo.getAge() >= this.rval);
    }

}