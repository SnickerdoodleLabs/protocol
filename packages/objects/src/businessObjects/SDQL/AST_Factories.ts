import { IpfsCID } from "@objects/primitives";
import { AST } from "./AST";
import { AST_Evaluator } from "./AST_Evaluator";

export class AST_Factories {

    static makeAST_Evaluator(cid: IpfsCID, ast: AST): AST_Evaluator {

        const astEvaluator = new AST_Evaluator(cid, ast);
        astEvaluator.postConstructor();
        return astEvaluator;
        
    }

}