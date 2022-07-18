import { IpfsCID, SDQL_Name } from "@objects/primitives";
import { AST_NetworkQuery } from "./AST_NetworkQuery";
import { AST_PropertyQuery } from "./AST_PropertyQuery";
import { SDQLSchema } from "./SDQLSchema";

export class SDQLParser {

    context: Map<string, any> = new Map();
    constructor(
        readonly cid: IpfsCID, 
        readonly schema: SDQLSchema
        ) {



    }

    parseQueries() {
        const querySchema = this.schema.getQuerySchema();
        let queries = Array<any>();
        for (let qName in querySchema) {
            let schema = querySchema[qName];

            let name = SDQL_Name(qName);

            switch(schema.name) {
                case "network":
                    queries.push(AST_NetworkQuery.fromSchema(name, schema));
                    break;
                default:
                    queries.push(AST_PropertyQuery.fromSchema(name, schema));
                    break;
            }
        }
    }
    
}