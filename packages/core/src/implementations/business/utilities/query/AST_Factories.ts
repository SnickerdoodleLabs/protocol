import { IpfsCID } from "@objects/primitives";
import { QueryRepository, SDQLParser } from ".";
import { AST_Evaluator } from "./AST_Evaluator";
import { SDQLSchema } from "@core/interfaces/objects";
import { AST } from "@core/interfaces/objects";

export class AST_Factories {

    static makeAST_Evaluator(cid: IpfsCID, ast: AST | null, queryRepository: QueryRepository): AST_Evaluator {

        const astEvaluator = new AST_Evaluator(cid, ast, queryRepository);
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