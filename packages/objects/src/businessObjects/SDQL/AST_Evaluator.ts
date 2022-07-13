import { IpfsCID, SDQL_Return } from "@objects/primitives";
import { AST } from "./AST";
import { Command_IF } from "./Command_IF";
import { AST_IFExpr } from "./AST_IFExpr";
import { AST_Query } from "./AST_Query";
import { Condition } from "./condition/Condition";

export class AST_Evaluator {
    constructor(
        readonly cid: IpfsCID,
        readonly ast: AST
    ) {}

    public eval(): SDQL_Return {
        return SDQL_Return(0);
    }

    public evalIf(eef: Command_IF): SDQL_Return {
        
        return SDQL_Return(0);
    }

    public evalQuery(q: AST_Query): SDQL_Return {
        
        return SDQL_Return(0);
    }

    public evalCondition(cond: Condition): SDQL_Return {
        
        return SDQL_Return(0);
    }

}