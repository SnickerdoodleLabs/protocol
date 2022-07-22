import { AST, SDQLParser } from "@objects/businessObjects";
import { SDQLSchema } from "@objects/businessObjects/SDQL/SDQLSchema";
import { IpfsCID } from "@objects/primitives";
import { AST_Evaluator } from "./AST_Evaluator";

export class AST_Factories {

    static makeAST_Evaluator(cid: IpfsCID, ast: AST | null): AST_Evaluator {

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