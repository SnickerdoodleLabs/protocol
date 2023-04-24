import "reflect-metadata";

import {
  AdKey,
  DataPermissions,
  DuplicateIdInSchema,
  EWalletDataType,
  InvalidRegularExpression,
  IpfsCID,
  ISDQLAd,
  ISDQLAnyEvaluatableString,
  ISDQLCompensationParameters,
  ISDQLCompensations,
  ISDQLInsightBlock,
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
import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ExprParser } from "@query-parser/implementations/business/ExprParser.js";
import {
  AST,
  AST_Ad,
  AST_BalanceQuery,
  AST_Compensation,
  AST_Expr,
  AST_Logic,
  AST_Web3Query,
  AST_PropertyQuery,
  AST_Query,
  AST_Return,
  AST_ReturnExpr,
  AST_Returns,
  Command,
  IQueryObjectFactory,
  ParserContextDataTypes,
  SDQLQueryWrapper,
  AST_ConditionExpr,
  AST_BoolExpr,
  Condition,
} from "@query-parser/interfaces/index.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight";
import { AST_RequireExpr } from "@query-parser/interfaces/objects/AST_RequireExpr";

export class SDQLParser {
  public exprParser: ExprParser | null = null;

  public context = new Map<string, ParserContextDataTypes>();

  public ads = new Map<SDQL_Name, AST_Ad>();
  public queries = new Map<SDQL_Name, AST_Query>();
  public insights = new Map<SDQL_Name, AST_Insight>();
  public compensations = new Map<SDQL_Name, AST_Compensation>();
  public compensationParameters: ISDQLCompensationParameters | null = null;

  constructor(
    readonly cid: IpfsCID,
    readonly schema: SDQLQueryWrapper,
    readonly queryObjectFactory: IQueryObjectFactory,
  ) {
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
    return this.parseQueries().andThen(() => {
      return this.parseAds().andThen(() => {
        return this.parseInsights().andThen(() => {
          return this.parseCompensations();
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
            this.insights,
            this.compensationParameters,
            this.compensations,
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
      this.validateCompenstations(schema),
    ]).map(() => {});
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

  // #endregion

  protected transformError(
    err: Error,
  ): DuplicateIdInSchema | QueryFormatError | MissingASTError {
    if (err instanceof DuplicateIdInSchema) {
      return err as DuplicateIdInSchema;
    }
    if (err instanceof QueryFormatError) {
      return err as QueryFormatError;
    }
    if (err instanceof ParserError) {
      return new QueryFormatError(err.message);
    }
    let stringified = JSON.stringify(err);
    if (stringified.length < 4) {
      stringified = err.message;
    }
    return new QueryFormatError(stringified);
  }

  // #region non-logic
  private parseAds(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {
    const adsSchema = this.schema.getAdsSchema();
    const adResults: ResultAsync<
      AST_Ad,
      DuplicateIdInSchema | QueryFormatError | MissingASTError
    >[] = [];
    for (const key in adsSchema) {
      const adKey = SDQL_Name(key); //'a1'
      const singleAdSchema = adsSchema[key] as ISDQLAd;

      adResults.push(this.parseAd(adKey, singleAdSchema));
    }

    return ResultUtils.combine(adResults).andThen((ads) => {
      ads.map((ad) => {
        this.ads.set(ad.name, ad);
        this.saveInContext(ad.name, ad);
        // this.targetAds.set(adsSchema[ad.name].target, ad.target);
        // this.adPermissions.set(
        //   adsSchema[ad.name].target,
        //   ad.requiredPermissions,
        // );
      });

      return okAsync(undefined);
    });
  }

  private parseAd(
    adKey: SDQL_Name,
    singleAdSchema: ISDQLAd,
  ): ResultAsync<
    AST_Ad,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {
    return ResultUtils.combine([
      this.parseTargetExpString(singleAdSchema.target),
      this.parseUnifiedDataPermissions([singleAdSchema.target]),
    ])
      .andThen(([adTarget, dataPermissions]) => {
        const ad = new AST_Ad(
          adKey,
          SDQL_Name(singleAdSchema.name),
          singleAdSchema.content,
          singleAdSchema.text,
          singleAdSchema.displayType,
          singleAdSchema.weight,
          singleAdSchema.expiry,
          singleAdSchema.keywords,
          adTarget,
          singleAdSchema.target,
          dataPermissions,
        );
        return okAsync(ad);
      })
      .orElse((err) => {
        return errAsync(this.transformError(err as Error));
      });
  }

  private parseQueries(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError
  > {
    try {
      const querySchema = this.schema.getQuerySchema();
      const queries = new Array<
        AST_Web3Query | AST_BalanceQuery | AST_PropertyQuery
      >();
      for (const qName in querySchema) {
        const queryName = SDQL_Name(qName);
        const schema = querySchema[qName];
        const schemaName = schema.name;

        const web3QueryType = AST_Web3Query.getWeb3QueryTypeIfValidQueryType(
          schema.name,
        );

        if (web3QueryType) {
          queries.push(
            this.queryObjectFactory.toWeb3Query(
              queryName,
              web3QueryType,
              schema,
            ),
          );
        } else if (schemaName === "balance") {
          queries.push(
            this.queryObjectFactory.toBalanceQuery(queryName, schema),
          );
        } else {
          queries.push(AST_PropertyQuery.fromSchema(queryName, schema));
        }
      }

      for (const query of queries) {
        this.saveInContext(query.name, query);
        this.queries.set(query.name, query);
      }

      return okAsync(undefined);
    } catch (err) {
      return errAsync(this.transformError(err as Error));
    }
  }

  private parseInsights(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {
    const insightSchema = this.schema.getInsightSchema();
    if (!insightSchema || Object.keys(insightSchema).length == 0) {
      return okAsync(undefined);
    }

    return ResultUtils.combine(
      Array.from(Object.keys(insightSchema)).map((iName) => {
        return this.parseInsight(SDQL_Name(iName), insightSchema[iName]);
      }),
    ).map((insights) => {
      insights.map((insight) => {
        this.insights.set(insight.name, insight);
        this.saveInContext(insight.name, insight);
      });
    });
  }

  private parseInsight(
    name: SDQL_Name,
    schema: ISDQLInsightBlock,
  ): ResultAsync<
    AST_Insight,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {
    return ResultUtils.combine([
      this.parseTargetExpString(schema.target),
      this.parseExpString(schema.returns),
      this.parseUnifiedDataPermissions([schema.target, schema.returns]),
    ])
      .mapErr(this.transformError)
      .map(([targetAst, returnsAst, dataPermissions]) => {
        return new AST_Insight(
          name,
          targetAst as AST_ConditionExpr,
          schema.target,
          returnsAst as AST_Expr,
          schema.returns,
          dataPermissions,
        );
      });
  }

  private parseCompensations(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {
    const compensationSchema = this.schema.getCompensationSchema();
    const compensations: [SDQL_Name, ISDQLCompensations][] = [];
    for (const cName in compensationSchema) {

      if (cName == "parameters") {
        // this is the parameters block
        this.compensationParameters = compensationSchema[
          cName
        ] as ISDQLCompensationParameters;
      } else {
        // This is a compensation
        compensations.push([
          SDQL_Name(cName),
          compensationSchema[cName] as ISDQLCompensations,
        ]);
      }
    }

    return ResultUtils.combine(
      compensations.map(([name, schema]) => {
        return this.parseCompensation(name, schema).map((ast) => {
          this.compensations.set(name, ast);
          this.saveInContext(name, ast);
        });
      }),
    ).map(() => {});
  }

  private parseCompensation(
    name: SDQL_Name,
    schema: ISDQLCompensations,
  ): ResultAsync<
    AST_Compensation,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {

    return this.parseExpString(schema.requires)
      .mapErr(this.transformError)
      .map((ast) => {
        return new AST_Compensation(
          name,
          schema.description,
          ast as AST_RequireExpr,
          schema.requires,
          schema.chainId,
          schema.callback,
          schema.alternatives ? schema.alternatives : [],
        );
      });
  }

  // #endregion

  // #region Logic

  public parseTargetExpString(
    target: string,
  ): ResultAsync<AST_ConditionExpr, ParserError | InvalidRegularExpression> {
    const ast = this.parseExpString(target);

    return this.parseExpString(target).andThen((ast) => {
      if (ast instanceof AST_ConditionExpr) {
        return okAsync(ast);
      }
      if (ast instanceof AST_BoolExpr) {
        return okAsync(
          new AST_ConditionExpr(
            ast.name,
            ast.source == null ? false : ast.source,
          ),
        );
      } else if (ast instanceof AST_Expr && ast.source instanceof AST_Query) {
        return okAsync(new AST_ConditionExpr(ast.name, ast.source));
      } else if (ast instanceof Condition) {
        return okAsync(
          new AST_ConditionExpr(SDQL_Name(ast.name as string), ast),
        );
      }
      return errAsync(
        new QueryFormatError(
          `wrong AST type for target expression: ${JSON.stringify(ast)}`,
        ),
      );
    });
  }

  public parseExpString(
    expStr: string,
  ): ResultAsync<AST_Expr | Command, ParserError | InvalidRegularExpression> {
    return this.exprParser!.parse(expStr).map((result) => {
      return result;
    });
    // if (this.exprParser) return this.exprParser.parse(expStr);
    // throw new Error("Expression Parser not found.");
  }

  /**
   * @deprecated
   */
  private parseLogicPermissions(
    expressions: ISDQLAnyEvaluatableString[],
  ): ResultAsync<
    Map<string, DataPermissions>,
    ParserError | InvalidRegularExpression
  > {
    const permMap: Map<string, DataPermissions> = new Map();
    // for (const expression of expressions) {
    //   permMap.set(expression, this.parseUnifiedDataPermissions([expression]));
    // }
    // return permMap;
    const results = expressions.map((expr) => {
      return this.parseUnifiedDataPermissions([expr]).map((perms) => {
        permMap.set(expr, perms);
        return undefined;
      });
    });

    return ResultUtils.combine(results).map((a) => permMap);
  }

  private parseUnifiedDataPermissions(
    expressions: ISDQLAnyEvaluatableString[],
  ): ResultAsync<DataPermissions, ParserError | InvalidRegularExpression> {
    return this.exprParser!.getUnifiedQueryDependencies(expressions).map(
      (queryDeps) => {
        return this.queriesToDataPermission(queryDeps);
      },
    );
  }

  public parseAdDependencies(
    compensationExpression: ISDQLAnyEvaluatableString,
  ): ResultAsync<AST_Ad[], ParserError | InvalidRegularExpression> {
    return this.exprParser!.getAdDependencies(compensationExpression);
  }

  public parseQueryDependencies(
    compensationExpression: ISDQLAnyEvaluatableString,
  ): ResultAsync<AST_Query[], ParserError | InvalidRegularExpression> {
    return this.exprParser!.getQueryDependencies(compensationExpression);
  }

  public parseInsightDependencies(
    compensationExpression: ISDQLAnyEvaluatableString,
  ): ResultAsync<AST_Insight[], ParserError | InvalidRegularExpression> {
    return this.exprParser!.getInsightDependencies(compensationExpression);
  }

  public queriesToDataPermission(queries: AST_Query[]): DataPermissions {
    const dataTypes = queries.reduce<EWalletDataType[]>((array, query) => {
      const permission = this.getQueryPermissionFlag(query);
      if (permission.isOk()) {
        array.push(permission.value);
      }
      return array;
    }, []);
    return DataPermissions.createWithPermissions(dataTypes);
  }

  public queryIdsToDataPermissions(ids: string[]): DataPermissions {
    const queries: AST_Query[] = [];
    ids.reduce<AST_Query[]>((queries, id) => {
      const query = this.context.get(SDQL_Name(id));
      if (query != null) {
        queries.push(query as AST_Query);
      }
      return queries;
    }, queries);

    return this.queriesToDataPermission(queries);
  }

  public getQueryPermissionFlag(
    query: AST_Query,
  ): Result<EWalletDataType, MissingWalletDataTypeError> {
    return query.getPermission();
  }
  // #endregion
}
