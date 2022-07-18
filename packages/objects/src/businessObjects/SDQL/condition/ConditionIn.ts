import { SDQL_OperatorName, URLString } from "@objects/primitives";
import { AST_Expr } from "../AST_Expr";
import { Condition } from "./Condition";

export class ConditionIn extends Condition {

    constructor(
        name: SDQL_OperatorName,
        readonly lval: null | AST_Expr,
        readonly rvals: Array<number | string | URLString> | AST_Expr

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
    check(): boolean {
        // TODO
        return true;
    }

}