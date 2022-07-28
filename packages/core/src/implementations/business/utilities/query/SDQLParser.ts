
import "reflect-metadata";

import { AST, AST_Compensation, AST_Expr, AST_Logic, AST_NetworkQuery, AST_PropertyQuery, AST_Query, AST_Return, AST_ReturnExpr, AST_Returns, Command, SDQLSchema } from "@core/interfaces/objects";
import { ExprParser } from "./ExprParser";
import { DuplicateIdInSchema, IpfsCID, ReturnNotImplementedError, SDQL_Name, URLString, Version } from "@snickerdoodlelabs/objects";

export class SDQLParser {

    context: Map<string, any> = new Map();
    queries: Map<SDQL_Name, AST_Query> = new Map();
    returns: AST_Returns | null;
    compensations: Map<SDQL_Name, AST_Compensation> = new Map();
    logicReturns: Map<string, AST_Expr | Command> = new Map();
    logicCompensations: Map<string, AST_Expr | Command> = new Map();

    exprParser: ExprParser | null = null;
    
    constructor(
        readonly cid: IpfsCID, 
        readonly schema: SDQLSchema
        ) {
            this.returns = null;
            this.exprParser = new ExprParser(this.context);
    }

    private saveInContext(name:any, val: any):void {
        if (this.context.get(name)) {
            throw new DuplicateIdInSchema(name);
        }

        this.context.set(name, val);
    }

    private parse() {
        // const queries = this.parseQueries();
        this.parseQueries();

        this.returns = new AST_Returns(URLString(this.schema.getReturnSchema().url))
        this.parseReturns();

        this.parseCompensations()

        this.parseLogic();

    }

    buildAST(): AST {

        this.parse();

        return new AST(
            Version(this.schema["version"]),
            this.schema["description"],
            this.schema["business"],
            this.queries,
            this.returns,
            this.compensations,
            new AST_Logic(
                this.logicReturns, this.logicCompensations
            )

        );
    }

    // #region non-logic
    private parseQueries() {
        const querySchema = this.schema.getQuerySchema();
        let queries = new Array<any>();
        for (let qName in querySchema) {

            // console.log(`parsing query ${qName}`);
            let name = SDQL_Name(qName);
            let schema = querySchema[qName];

            switch(schema.name) {
                case "network":
                    // console.log(`${qName} is a network query`);
                    queries.push(AST_NetworkQuery.fromSchema(name, schema));
                    break;
                default:
                    // console.log(`${qName} is a property query`);
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

            // console.log(`parsing return ${rName}`);

            let name = SDQL_Name(rName);
            let schema = returnsSchema[rName];

            if (typeof schema === 'string') {
                continue;
            }

            if ("query" in schema) {
                // console.log(`${rName} is a query`);
                let returnExpr = new AST_ReturnExpr(
                    name, 
                    this.context.get(SDQL_Name(schema.query))
                );

                returns.push(returnExpr);
            } else if ("message" in schema) {

                // console.log(`${rName} is a message`);
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

        for (let cName in compensationSchema) {

            // console.log(`parsing compensation ${cName}`);

            let name = SDQL_Name(cName);
            let schema = compensationSchema[cName];
            let compensation = new AST_Compensation(
                                    name,
                                    schema.description,
                                    URLString(schema.callback)
                                );

            this.compensations.set(compensation.name, compensation);
            this.saveInContext(cName, compensation);
        }

    }
    // #endregion

    // #region Logic
    public parseExpString(expStr:string): AST_Expr | Command {
        if (this.exprParser)
            return this.exprParser.parse(expStr);
        throw new Error("Expression Parser not found.");
    }

    private parseLogic() {
        const logicSchema = this.schema.getLogicSchema();
        this.logicReturns = this.parseLogicExpressions(logicSchema["returns"]);
        this.logicCompensations = this.parseLogicExpressions(logicSchema["compensations"]);

    }

    // private parseLogicReturns(logicSchema: Array<string>): Map<string, AST_Expr> {
    //     let lrs = new Map<string, AST_Expr>();
    //     for (let expStr of logicSchema) {
    //         let exp = this.parseExpString(expStr);
    //         lrs.set(expStr, exp)

    //     }
    //     return lrs;
    // }

    private parseLogicExpressions(expressions: Array<string>): Map<string, AST_Expr | Command> {

        // console.log('expressions', expressions);
        let lrs = new Map<string, AST_Expr | Command>();
        for (let expStr of expressions) {
            let exp = this.parseExpString(expStr);
            lrs.set(expStr, exp)

        }
        return lrs;
    }

    // #endregion
    
}