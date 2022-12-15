import "reflect-metadata";

import {
  DataPermissions,
  DuplicateIdInSchema,
  EWalletDataType,
  IpfsCID,
  ISDQLAd,
  ISDQLCompensationParameters,
  ISDQLCompensations,
  MissingASTError,
  MissingTokenConstructorError,
  MissingWalletDataTypeError,
  ParserError,
  QueryExpiredError,
  QueryFormatError,
  SDQL_Name,
  URLString,
  Version,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ExprParser } from "@query-parser/implementations/business/ExprParser.js";
import {
  AST,
  AST_Ad,
  AST_BalanceQuery,
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
  IQueryObjectFactory,
  ParserContextDataTypes,
  SDQLQueryWrapper,
} from "@query-parser/interfaces/index.js";

export class SDQLParser {
  public context = new Map<string, ParserContextDataTypes>(); //Global key-block umbrella
  public ads = new Map<SDQL_Name, AST_Ad>();
  public queries = new Map<SDQL_Name, AST_Query>();
  public returns: AST_Returns | null;
  public compensations = new Map<SDQL_Name, AST_Compensation>();
  public compensationParameters: ISDQLCompensationParameters | null = null;
  public logicReturns = new Map<string, AST_Expr | Command>();
  public logicCompensations = new Map<string, AST_Expr | Command>();
  public logicAds = new Map<string, AST_Expr | Command>();
  public returnPermissions = new Map<string, DataPermissions>();
  public compensationPermissions = new Map<string, DataPermissions>();
  public eligibleAds = new Map<string, DataPermissions>();

  public exprParser: ExprParser | null = null;

  constructor(
    readonly cid: IpfsCID,
    readonly schema: SDQLQueryWrapper,
    readonly queryObjectFactory: IQueryObjectFactory,
  ) {
    this.returns = null;
    this.exprParser = new ExprParser(this.context);
  }

  private saveInContext(name: string, val: ParserContextDataTypes): void {
    if (this.context.get(name)) {
      const err = new DuplicateIdInSchema(name);
      // console.error(err);
      throw err;
    }

    this.context.set(name, val);
  }

  private parse(): ResultAsync<
    void,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
  > {
    return this.parseAds().andThen(() => {
      return this.parseQueries().andThen(() => {
        return this.parseReturns().andThen(() => {
          return this.parseCompensations().andThen(() => {
            return this.parseLogic().andThen(() => {
              return this.parsePermissions();
            });
          });
        });
      });
    });
  }

  buildAST(): ResultAsync<
    AST,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.validateSchema(this.schema, this.cid).andThen(() => {
      return this.parse().andThen(() => {
        return okAsync(
          new AST(
            Version(this.schema.version!),
            this.schema.description,
            this.schema.business,
            this.ads,
            this.queries,
            this.returns,
            this.compensationParameters,
            this.compensations,
            new AST_Logic(
              this.logicReturns,
              this.logicCompensations,
              this.logicAds,
              this.returnPermissions,
              this.compensationPermissions,
              this.eligibleAds
            ),
          ),
        );
      });
    });
  }

  // #region schema validation
  public validateSchema(
    schema: SDQLQueryWrapper,
    cid: IpfsCID,
  ): ResultAsync<void, QueryFormatError | QueryExpiredError> {
    return ResultUtils.combine([
      this.validateMeta(schema),
      this.validateTimeStampExpiry(schema, cid),
      this.validateQuery(schema),
      this.validateReturns(schema),
      this.validateCompenstations(schema),
      this.validateReturns(schema),
      this.validateLogic(schema),
    ]).andThen(() => {
      return okAsync(undefined);
    });
  }

  public validateMeta(
    schema: SDQLQueryWrapper,
  ): ResultAsync<void, QueryFormatError | QueryExpiredError> {
    if (schema.version === undefined) {
      return errAsync(new QueryFormatError("schema missing version"));
    }
    if (schema.description === undefined) {
      return errAsync(new QueryFormatError("schema missing description"));
    }
    if (schema.business === undefined) {
      return errAsync(new QueryFormatError("schema missing business"));
    }
    return okAsync(undefined);
  }

  public validateTimeStampExpiry(
    schema: SDQLQueryWrapper,
    cid: IpfsCID,
  ): ResultAsync<void, QueryFormatError | QueryExpiredError> {
    if (schema.timestamp == null) {
      return errAsync(new QueryFormatError("schema missing timestamp"));
    } else if (isNaN(schema.timestamp)) {
      return errAsync(new QueryFormatError("Invalid timestamp date format"));
    }

    if (schema.expiry == null) {
      return errAsync(new QueryFormatError("schema missing expiry"));
    } else if (isNaN(schema.expiry)) {
      return errAsync(new QueryFormatError("Invalid expiry date format"));
    } else if (schema.isExpired()) {
      return errAsync(
        new QueryExpiredError("Tried to execute an expired query", cid),
      );
    }
    return okAsync(undefined);
  }

  public validateQuery(
    schema: SDQLQueryWrapper,
  ): ResultAsync<void, QueryFormatError | QueryFormatError> {
    if (schema.queries === undefined) {
      return errAsync(new QueryFormatError("schema missing queries"));
    }
    return okAsync(undefined);
  }

  public validateCompenstations(
    schema: SDQLQueryWrapper,
  ): ResultAsync<void, QueryFormatError | QueryFormatError> {
    if (schema.compensations === undefined) {
      return errAsync(new QueryFormatError("schema missing compensations"));
    }

    // TODO:
    // 1. validate alternatives
    // 2. validate required parameters are in parameters block
    return okAsync(undefined);
  }

  public validateReturns(
    schema: SDQLQueryWrapper,
  ): ResultAsync<void, QueryFormatError | QueryFormatError> {
    if (schema.returns === undefined) {
      return errAsync(new QueryFormatError("schema missing returns"));
    }
    return okAsync(undefined);
  }

  public validateLogic(
    schema: SDQLQueryWrapper,
  ): ResultAsync<void, QueryFormatError | QueryExpiredError> {
    if (schema.logic === undefined) {
      return errAsync(new QueryFormatError("schema missing logic"));
    }
    if (schema.logic["returns"] === undefined) {
      return errAsync(new QueryFormatError("schema missing logic->returns"));
    }

    if (schema.logic["compensations"] === undefined) {
      return errAsync(
        new QueryFormatError("schema missing logic->compensations"),
      );
    }

    // if (schema.logic["ads"] === undefined) {
    //   return errAsync(
    //     new QueryFormatError("schema missing logic->ads"),
    //   );
    // }

    return okAsync(undefined);
  }
  // #endregion

  // #region non-logic
  private parseAds(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError
  > {
    try {
      const adsSchema = this.schema.getAdsSchema();

      for (const key in adsSchema) {

        const adKey = SDQL_Name(key); //'a1'
        const singleAdSchema = adsSchema[key] as ISDQLAd;
        const ad = new AST_Ad(
          SDQL_Name(singleAdSchema.name),
          singleAdSchema.content,
          singleAdSchema.text,
          singleAdSchema.type,
          singleAdSchema.weight,
          singleAdSchema.expiry,
          singleAdSchema.keywords
        );

        this.ads.set(adKey, ad);
        this.saveInContext(key, ad);
      }

      return okAsync(undefined);

    } catch (err) {
      if (err instanceof DuplicateIdInSchema) {
        return errAsync(err as DuplicateIdInSchema);
      }
      if (err instanceof QueryFormatError) {
        return errAsync(err as QueryFormatError);
      }
      return errAsync(new QueryFormatError(JSON.stringify(err)));
    }
  }

  private parseQueries(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError
  > {
    try {
      const querySchema = this.schema.getQuerySchema();
      const queries = new Array<
        AST_NetworkQuery | AST_BalanceQuery | AST_PropertyQuery
      >();
      for (const qName in querySchema) {
        // console.log(`parsing query ${qName}`);
        const name = SDQL_Name(qName);
        const schema = querySchema[qName];

        switch (schema.name) {
          case "network":
            // console.log(`${qName} is a network query`);
            queries.push(AST_NetworkQuery.fromSchema(name, schema));
            break;

          case "balance":
            queries.push(this.queryObjectFactory.toBalanceQuery(name, schema));
            break;

          default:
            // console.log(`${qName} is a property query`);
            queries.push(AST_PropertyQuery.fromSchema(name, schema));
            break;
        }
      }

      // return okAsync(queries

      for (const query of queries) {
        this.saveInContext(query.name, query);
        this.queries.set(query.name, query);
      }

      return okAsync(undefined);
    } catch (err) {
      if (err instanceof DuplicateIdInSchema) {
        return errAsync(err as DuplicateIdInSchema);
      }
      if (err instanceof QueryFormatError) {
        return errAsync(err as QueryFormatError);
      }
      return errAsync(new QueryFormatError(JSON.stringify(err)));
    }

    // return queries;
  }

  private parseReturns(): ResultAsync<
    void,
    DuplicateIdInSchema 
    | QueryFormatError
    | MissingASTError
  > {
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
          
          const source = this.context.get(SDQL_Name(schema.query!)) as AST_Query | AST_Return;
          if (null == source) {
            return errAsync(new MissingASTError(schema.query!))
          }
          const returnExpr = new AST_ReturnExpr(
            name,
            source
          );
          returns.push(returnExpr);

        } else if ("message" in schema) {

          const source = new AST_Return(SDQL_Name(schema.name), schema.message!);
          const returnExpr = new AST_ReturnExpr(
            name,
            source
          );
          returns.push(returnExpr);

        } else {

          // const err = new ReturnNotImplementedError(rName);
          // console.error(err);
          // throw err;
          return errAsync(new QueryFormatError("Missing type definition", 0, schema));

        }
      }

      this.returns = new AST_Returns(URLString(returnsSchema.url));

      for (const r of returns) {
        this.saveInContext(r.name, r);
        this.returns.expressions.set(r.name, r);
      }

      return okAsync(undefined);
    } catch (err) {
      if (err instanceof DuplicateIdInSchema) {
        return errAsync(err as DuplicateIdInSchema);
      }
      if (err instanceof QueryFormatError) {
        return errAsync(err as QueryFormatError);
      }
      return errAsync(new QueryFormatError(JSON.stringify(err)));
    }
  }

  private parseCompensations(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError
  > {
    try {
      const compensationSchema = this.schema.getCompensationSchema();

      for (const cName in compensationSchema) {
        // console.log(`parsing compensation ${cName}`);

        if (cName == "parameters") {
          // this is the parameters block
          this.compensationParameters = compensationSchema[cName] as ISDQLCompensationParameters;

        } else { 
          // This is a compensation
          const name = SDQL_Name(cName);
          const schema = compensationSchema[cName] as ISDQLCompensations;
          const compensation = new AST_Compensation(
            name,
            schema.description,
            schema.chainId,
            schema.callback,
            schema.alternatives ? schema.alternatives : []
          );
  
          this.compensations.set(compensation.name, compensation);
          this.saveInContext(cName, compensation);
        }
       
      }

      return okAsync(undefined);

    } catch (err) {
      if (err instanceof DuplicateIdInSchema) {
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

  private parseLogic(): ResultAsync<
    void,
    ParserError | MissingTokenConstructorError | QueryFormatError
  > {
    try {
      const logicSchema = this.schema.getLogicSchema();
      this.logicReturns = this.parseLogicExpressions(logicSchema.returns);
      this.logicCompensations = this.parseLogicExpressions(
        logicSchema.compensations,
      );
      this.logicAds = this.parseLogicExpressions(
        logicSchema.ads,
      );

      return okAsync(undefined);
    } catch (err) {
      if (err instanceof ParserError) {
        return errAsync(err as ParserError);
      }
      if (err instanceof MissingTokenConstructorError) {
        return errAsync(err as MissingTokenConstructorError);
      }
      return errAsync(new QueryFormatError(JSON.stringify(err)));
    }
  }

  private parseLogicExpressions(
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

  private parsePermissions(): ResultAsync<
    void,
    ParserError | MissingWalletDataTypeError
  > {
    try {
      const logicSchema = this.schema.getLogicSchema();
      this.returnPermissions = this.parseLogicPermissions(
        logicSchema["returns"],
      );
      // this.adPermissions = this.parseLogicPermissions(
      //   logicSchema["ads"],
      // );
      this.compensationPermissions = this.parseLogicPermissions(
        logicSchema["compensations"],
      );
      return okAsync(undefined);
    } catch (err) {
      return errAsync(err as MissingWalletDataTypeError);
    }
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
    return DataPermissions.createWithPermissions(
      queries.map((query) => {
        return this.getQueryPermissionFlag(query);
      }),
    );
  }

  public queryIdsToDataPermissions(ids: string[]): DataPermissions {
    
    const queries:AST_Query[] = [];
    ids.reduce<AST_Query[]>((queries, id) => {
      const query = this.context.get(SDQL_Name(id))
      if (query != null) {
        queries.push(query as AST_Query);
      }
      return queries;
    }, queries);

    return this.queriesToDataPermission(queries);
  }

  public getQueryPermissionFlag(query: AST_Query): EWalletDataType {
    switch (query.constructor) {
      case AST_NetworkQuery:
        return EWalletDataType.EVMTransactions;
      case AST_BalanceQuery:
        return EWalletDataType.AccountBalances;
      case AST_PropertyQuery:
        return this.getPropertyQueryPermissionFlag(query);
      default:
        const err = new MissingWalletDataTypeError(query.constructor.name);
        console.error(err);
        throw err;
    }
  }

  private getPropertyQueryPermissionFlag(query: AST_Query) {
    const propQuery = query as AST_PropertyQuery;
    switch (propQuery.property) {
      case "age":
        return EWalletDataType.Age;
      case "gender":
        return EWalletDataType.Gender;
      case "givenName":
        return EWalletDataType.GivenName;
      case "familyName":
        return EWalletDataType.FamilyName;
      case "birthday":
        return EWalletDataType.Birthday;
      case "email":
        return EWalletDataType.Email;
      case "location":
        return EWalletDataType.Location;
      case "browsing_history":
        return EWalletDataType.SiteVisits;
      case "url_visited_count":
        return EWalletDataType.SiteVisits;
      case "chain_transactions":
        return EWalletDataType.EVMTransactions;
      default:
        const err = new MissingWalletDataTypeError(propQuery.property);
        console.error(err);
        throw err;
    }
  }
  // #endregion
}
