import { IpfsCID, SDQL_Name } from "@objects/primitives";
import { AST } from "prettier";
import { AST_NetworkQuery } from "./AST_NetworkQuery";
import { AST_PropertyQuery } from "./AST_PropertyQuery";
import { AST_Return } from "./AST_Return";
import { AST_ReturnExpr } from "./AST_ReturnExpr";
import { DuplicateIdInSchema, ReturnNotImplementedError } from "./exceptions";
import { SDQLSchema } from "./SDQLSchema";

export class SDQLParser {

    context: Map<string, any> = new Map();
    
    constructor(
        readonly cid: IpfsCID, 
        readonly schema: SDQLSchema
        ) {
    }

    private saveInContext(name:any, val: any):void {
        if (this.context.get(name)) {
            throw new DuplicateIdInSchema(name);
        }

        this.context.set(name, val);
    }

    parse() {
        // const queries = this.parseQueries();
        this.parseQueries();
        this.parseReturns();
    }

    parseQueries() {
        const querySchema = this.schema.getQuerySchema();
        let queries = Array<any>();
        for (let qName in querySchema) {

            console.log(`parsing query ${qName}`);
            let name = SDQL_Name(qName);
            let schema = querySchema[qName];

            switch(schema.name) {
                case "network":
                    console.log(`${qName} is a network query`);
                    queries.push(AST_NetworkQuery.fromSchema(name, schema));
                    break;
                default:
                    console.log(`${qName} is a property query`);
                    queries.push(AST_PropertyQuery.fromSchema(name, schema));
                    break;
            }
        }

        for (let query of queries) {
            this.saveInContext(query.name, query);
        }

        // return queries;
    }

    parseReturns() {
        const returnsSchema = this.schema.getReturnSchema();
        const returns = Array<AST_ReturnExpr>();

        for (let rName in returnsSchema) {

            console.log(`parsing return ${rName}`);

            let name = SDQL_Name(rName);
            let schema = returnsSchema[rName];

            if (typeof schema === 'string') {
                continue;
            }

            if ("query" in schema) {
                console.log(`${rName} is a query`);
                let returnExpr = new AST_ReturnExpr(
                    name, 
                    this.context.get(SDQL_Name(schema.query))
                );

                returns.push(returnExpr);
            } else if ("message" in schema) {

                console.log(`${rName} is a message`);
                let returnExpr = new AST_ReturnExpr(
                    name, 
                    new AST_Return(name, schema.message)
                );

                returns.push(returnExpr);

            } else {
                throw new ReturnNotImplementedError(rName);
            }
        }

        for (let r of returns) {
            this.saveInContext(r.name, r);
        }
    }

    
    
}