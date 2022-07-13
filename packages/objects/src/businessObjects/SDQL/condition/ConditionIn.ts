import { SDQL_OperatorName } from "@objects/primitives";
import { Condition } from "./Condition";
import { IDataWalletPersistence } from "@browser-extension/interfaces";

export class ConditionIn extends Condition {

    constructor(
        name: SDQL_OperatorName,
        readonly vals: Array<number>,
        protected persistenceRepo: IDataWalletPersistence

    ) {
        super(name);
    }

    public result(): boolean{
        for (let i = 0; i < this.vals.length; i++){
            if (this.vals[i] == this.persistenceRepo.getLocation()) {
                return (true);
            } 
        }                      
        return (false);
    }

}