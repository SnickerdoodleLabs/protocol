import { IpfsCID } from "@objects/primitives";
import { AST } from "./AST";
import { AST_Evaluator } from "./AST_Evaluator";
import { AST_Logic } from "./AST_Logic";
import { SDQLParser } from "./SDQLParser";
import { SDQLSchema } from "./SDQLSchema";

export class AST_Factories {

    static makeAST_Evaluator(cid: IpfsCID, ast: AST): AST_Evaluator {

        const astEvaluator = new AST_Evaluator(cid, ast);
        astEvaluator.postConstructor();
        return astEvaluator;
        
    }

    // static makeAST_Logic(schema: string): AST_Logic {
        
    // }

    static makeParser(cid: IpfsCID, schemaString: string): SDQLParser {

        const schema = SDQLSchema.fromString(schemaString);
        return new SDQLParser(cid, schema);
        
    }

}