import "reflect-metadata";

import {
  IpfsCID,
  SDQL_Name,
  URLString,
  Version,
  DuplicateIdInSchema,
  ReturnNotImplementedError,
  ParserError,
  QueryFormatError,
  MissingTokenConstructorError,
  DataPermissions,
  EWalletDataType,
  MissingWalletDataTypeError,
} from "@snickerdoodlelabs/objects";

import { ExprParser } from "@core/implementations/business/utilities/query/ExprParser";
import {
  AST,
  AST_Compensation,
  AST_Expr,
  AST_Logic,
  AST_NetworkQuery,
  AST_PropertyQuery,
  AST_Query,
  AST_Return,
  AST_ReturnExpr,
  AST_Returns,
  Command,
  SDQLSchema,
} from "@core/interfaces/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IQueryObjectFactory } from "@core/interfaces/utilities/factory";

export class SDQLParser {

  context: Map<string, any> = new Map();
  queries: Map<SDQL_Name, AST_Query> = new Map();
  returns: AST_Returns | null;
  compensations: Map<SDQL_Name, AST_Compensation> = new Map();
  yarn 
  logicReturns: Map<string, AST_Expr | Command> = new Map();
  logicCompensations: Map<string, AST_Expr | Command> = new Map();
  returnPermissions: Map<string, DataPermissions> = new Map();
  compenstationPermissions: Map<string, DataPermissions> = new Map();

  exprParser: ExprParser | null = null;

  constructor(
    readonly cid: IpfsCID, 
    readonly schema: SDQLSchema,
    readonly queryObjectFactory: IQueryObjectFactory
    ) {
    this.returns = null;
    this.exprParser = new ExprParser(this.context);
  }

  private saveInContext(name: any, val: any): void {
    if (this.context.get(name)) {
      throw new DuplicateIdInSchema(name);
    }

    this.context.set(name, val);
  }

  private parse(): ResultAsync<
    void, 
    ParserError 
    | DuplicateIdInSchema 
    | QueryFormatError
    | MissingTokenConstructorError
    > {
    // const queries = this.parseQueries();
   
    // this.parseQueries();

    // this.returns = new AST_Returns(
    //   URLString(this.schema.getReturnSchema().url),
    // );
    // this.parseReturns();

    // this.parseCompensations();

    // this.parseLogic();

    return this.parseQueries()
      .andThen(() => {

        return this.parseReturns()
          .andThen(() => {

            return this.parseCompensations()
            .andThen(() => {

              return this.parseLogic()
              .andThen(() => {
                return this.parsePermissions();
              });
              
            });

          });
      })
  }

  buildAST(): ResultAsync<
    AST, 
    ParserError 
    | DuplicateIdInSchema 
    | QueryFormatError
    | MissingTokenConstructorError
    > {

    return this.parse()
      .andThen(() => {

        return okAsync(
          new AST(
            Version(this.schema["version"]),
            this.schema["description"],
            this.schema["business"],
            this.queries,
            this.returns,
            this.compensations,
            new AST_Logic(this.logicReturns, this.logicCompensations),
          )
        );
        
      });

  }

  // #region non-logic
  private parseQueries(): ResultAsync<void, DuplicateIdInSchema | QueryFormatError> {

    try {

      const querySchema = this.schema.getQuerySchema();
      const queries = new Array<any>();
      for (const qName in querySchema) {
        // console.log(`parsing query ${qName}`);
        const name = SDQL_Name(qName);
        const schema = querySchema[qName];
  
        switch (schema.name) {
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
  
      for (const query of queries) {
        this.saveInContext(query.name, query);
        this.queries.set(query.name, query);
      }

      return okAsync(undefined);
      
    } catch (err) {
      if (err instanceof DuplicateIdInSchema)  {
        return errAsync(err as DuplicateIdInSchema);
      }
      if (err instanceof QueryFormatError) {
        return errAsync(err as QueryFormatError);
      }
      return errAsync(new QueryFormatError(JSON.stringify(err)));
    }

    // return queries;
  }

  private parseReturns(): ResultAsync<void, DuplicateIdInSchema | QueryFormatError> {
    
    try {

      const returnsSchema = this.schema.getReturnSchema();
      const returns = new Array<AST_ReturnExpr>();

      for (const rName in returnsSchema) {
        // console.log(`parsing return ${rName}`);

        const name = SDQL_Name(rName);
        const schema = returnsSchema[rName];

        if (typeof schema === "string") {
          continue;
        }

        if ("query" in schema) {
          // console.log(`${rName} is a query`);
          const returnExpr = new AST_ReturnExpr(
            name,
            this.context.get(SDQL_Name(schema.query)),
          );

          returns.push(returnExpr);
        } else if ("message" in schema) {
          // console.log(`${rName} is a message`);
          const returnExpr = new AST_ReturnExpr(
            name,
            new AST_Return(schema.name, schema.message),
          );

          returns.push(returnExpr);
        } else {
          throw new ReturnNotImplementedError(rName);
        }
      }

      this.returns = new AST_Returns(
        URLString(returnsSchema.url),
      );

      for (const r of returns) {
        this.saveInContext(r.name, r);
        this.returns.expressions.set(r.name, r);
      }

      return okAsync(undefined);

    } catch (err) {
      if (err instanceof DuplicateIdInSchema)  {
        return errAsync(err as DuplicateIdInSchema);
      }
      if (err instanceof QueryFormatError) {
        return errAsync(err as QueryFormatError);
      }
      return errAsync(new QueryFormatError(JSON.stringify(err)));
    }
  }

  private parseCompensations(): ResultAsync<void, DuplicateIdInSchema | QueryFormatError> {
    try {

      const compensationSchema = this.schema.getCompensationSchema();

      for (const cName in compensationSchema) {
        // console.log(`parsing compensation ${cName}`);

        const name = SDQL_Name(cName);
        const schema = compensationSchema[cName];
        const compensation = new AST_Compensation(
          name,
          schema.description,
          URLString(schema.callback),
        );

        this.compensations.set(compensation.name, compensation);
        this.saveInContext(cName, compensation);
      }
      
      return okAsync(undefined);

    } catch (err) {
      if (err instanceof DuplicateIdInSchema)  {
        return errAsync(err as DuplicateIdInSchema);
      }
      if (err instanceof QueryFormatError) {
        return errAsync(err as QueryFormatError);
      }
      return errAsync(new QueryFormatError(JSON.stringify(err)));
    }
  }
  // #endregion

  // #region Logic

  private parseLogic(): ResultAsync<void, ParserError | MissingTokenConstructorError | QueryFormatError> {

    try {

      const logicSchema = this.schema.getLogicSchema();
      this.logicReturns = this.parseLogicExpressions(logicSchema["returns"]);
      this.logicCompensations = this.parseLogicExpressions(
        logicSchema["compensations"],
      );

      return okAsync(undefined);

    } catch (err) {
      if (err instanceof ParserError)  {
        return errAsync(err as ParserError);
      }
      if (err instanceof MissingTokenConstructorError) {
        return errAsync(err as MissingTokenConstructorError);
      }
      return errAsync(new QueryFormatError(JSON.stringify(err)));
    }
  }


  private parseLogicExpressions (
    expressions: Array<string>,
  ): Map<string, AST_Expr | Command> {
    // console.log('expressions', expressions);
    const lrs = new Map<string, AST_Expr | Command>();
    for (const expStr of expressions) {
      const exp = this.parseExpString(expStr);
      lrs.set(expStr, exp);
    }
    return lrs;
  }
  
  public parseExpString(expStr: string): AST_Expr | Command {
    return this.exprParser!.parse(expStr);
    // if (this.exprParser) return this.exprParser.parse(expStr);
    // throw new Error("Expression Parser not found.");
  }


  private parsePermissions(): ResultAsync<void, ParserError> {
    const logicSchema = this.schema.getLogicSchema();
    this.returnPermissions = this.parseLogicPermissions(logicSchema['returns']);
    this.compenstationPermissions = this.parseLogicPermissions(logicSchema['compensations']);
    return okAsync(undefined);

  }

  private parseLogicPermissions(
    expressions: Array<string>,
  ): Map<string, DataPermissions> {
    const permMap = new Map();
    for (const expression of expressions) {
      const queryDeps = this.exprParser!.getDependencies(expression);
      permMap.set(expression, this.queriesToDataPermission(queryDeps));
    }
    return permMap;
  }

  public queriesToDataPermission(queries: AST_Query[]): DataPermissions {

    let flags = 0; // we will or the flags
    for (const query of queries) {
      const flag = this.getQueryPermissionFlag(query);
      flags |= flag;
    }

    return new DataPermissions(flags);

  }

  public getQueryPermissionFlag(query: AST_Query): number {
    switch (query.constructor) {
      case AST_NetworkQuery:
        return EWalletDataType.EVMTransactions;
      default:
        throw new MissingWalletDataTypeError(query.constructor.name);
    }
  }


  // #endregion
}
