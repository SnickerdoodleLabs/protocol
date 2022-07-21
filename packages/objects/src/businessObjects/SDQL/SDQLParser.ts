import { IpfsCID, SDQL_Name, URLString } from "@objects/primitives";
import { AST } from "prettier";
import { AST_Compensation } from "./AST_Compensation";
import { AST_Expr } from "./AST_Expr";
import { AST_NetworkQuery } from "./AST_NetworkQuery";
import { AST_PropertyQuery } from "./AST_PropertyQuery";
import { AST_Query } from "./AST_Query";
import { AST_Return } from "./AST_Return";
import { AST_ReturnExpr } from "./AST_ReturnExpr";
import { AST_Returns } from "./AST_Returns";
import { DuplicateIdInSchema, ParsingError, ReturnNotImplementedError } from "./exceptions";
import { SDQLSchema } from "./SDQLSchema";

export class SDQLParser {

    context: Map<string, any> = new Map();
    queries: Map<SDQL_Name, AST_Query> = new Map();
    returns: AST_Returns | null;
    logicReturns: Map<string, AST_Expr> = new Map();
    logicCompensations: Map<string, AST_Expr> = new Map();
    
    constructor(
        readonly cid: IpfsCID, 
        readonly schema: SDQLSchema
        ) {
            this.returns = null;
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

        this.returns = new AST_Returns(URLString(this.schema.getReturnSchema().url))
        this.parseReturns();

        this.parseCompensations()

        // this.parseLogic();

    }

    private parseQueries() {
        const querySchema = this.schema.getQuerySchema();
        let queries = new Array<any>();
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
            this.queries.set(query.name, query);
        }

        // return queries;
    }

    private parseReturns() {
        const returnsSchema = this.schema.getReturnSchema();
        const returns = new Array<AST_ReturnExpr>();

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
                    new AST_Return(schema.name, schema.message)
                );

                returns.push(returnExpr);

            } else {
                throw new ReturnNotImplementedError(rName);
            }
        }

        for (let r of returns) {
            this.saveInContext(r.name, r);
            this.returns?.expressions.set(r.name, r);
        }
    }

    private parseCompensations() {
        const compensationSchema = this.schema.getCompensationSchema();
        const compensations = new Array<AST_Compensation>();

        for (let cName in compensationSchema) {

            console.log(`parsing compensation ${cName}`);

            let name = SDQL_Name(cName);
            let schema = compensationSchema[cName];
            let compensation = new AST_Compensation(
                                    name,
                                    schema.description,
                                    URLString(schema.callback)
                                );

            compensations.push(compensation);
            this.saveInContext(cName, compensation);
        }

    }

    public parseExpString(expStr:string): AST_Expr {
        throw new ParsingError("not implemented");
    }

    private parseLogic() {
        const logicSchema = this.schema.getLogicSchema();
        this.parseLogicReturns(logicSchema["returns"]);

    }

    private parseLogicReturns(logicSchema: Array<string>): Map<string, AST_Expr> {
        let lrs = new Map<string, AST_Expr>();
        for (let expStr of logicSchema) {
            let exp = this.parseExpString(expStr);
            lrs.set(expStr, exp)

        }
        return lrs;
    }

    
    
}