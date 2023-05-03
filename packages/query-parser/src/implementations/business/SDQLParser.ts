import "reflect-metadata";

import {
  AdKey,
  CompensationKey,
  DuplicateIdInSchema,
  InsightKey,
  InvalidRegularExpression,
  IpfsCID,
  ISDQLAd,
  ISDQLCompensationParameters,
  ISDQLCompensations,
  ISDQLInsightBlock,
  MissingASTError,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFormatError,
  SDQL_Name,
  Version,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ExprParser } from "@query-parser/implementations/business/ExprParser.js";
import {
  AST,
  AST_Ad,
  AST_BalanceQuery,
  AST_BoolExpr,
  AST_Compensation,
  AST_ConditionExpr,
  AST_Expr,
  AST_PropertyQuery,
  AST_RequireExpr as AST_RequiresExpr,
  AST_SubQuery,
  AST_Web3Query,
  Condition,
  IQueryObjectFactory,
  ParserContextDataTypes,
  SDQLQueryWrapper,
} from "@query-parser/interfaces/index.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight";

export class SDQLParser {
  public context = new Map<string, ParserContextDataTypes>();
  public exprParser: ExprParser;

  public queries = new Map<SDQL_Name, AST_SubQuery>();
  public ads = new Map<SDQL_Name, AST_Ad>();
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

  public buildAST(): ResultAsync<
    AST,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.validateSchema(this.schema, this.cid).andThen(() => {
      return this.parse().map(() => {
        return new AST(
          Version(this.schema.version!),
          this.schema.description,
          this.schema.business,
          this.ads,
          this.queries,
          this.insights,
          this.compensationParameters,
          this.compensations,
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
      this.validateTimestampExpiry(schema, cid),
      this.validateAds(schema),
      this.validateInsights(schema),
      this.validateCompensations(schema),
    ])
      .mapErr((e) => e)
      .map(() => {});
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

  public validateTimestampExpiry(
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

  private validateAds(
    schema: SDQLQueryWrapper,
  ): ResultAsync<void, QueryFormatError> {
    const adSchema = schema.getAdsSchema();
    if (adSchema == null || Object.keys(adSchema).length == 0) {
      return okAsync(undefined);
    }
    return ResultUtils.combine(
      (Array.from(Object.keys(adSchema)) as AdKey[]).map((adKey) => {
        return this.validateAd(adKey, adSchema[adKey]);
      }),
    )
      .mapErr((e) => e)
      .map(() => {});
  }

  private validateAd(
    adKey: AdKey,
    ad: ISDQLAd,
  ): ResultAsync<void, QueryFormatError> {
    if (
      ad.name == null ||
      ad.content.type == null ||
      ad.content.src == null ||
      ad.text == null ||
      ad.displayType == null ||
      ad.weight == null ||
      ad.expiry == null ||
      ad.keywords == null
    ) {
      return errAsync(new QueryFormatError(`Corrupted ad: ${adKey}`));
    }
    return okAsync(undefined);
  }

  private validateInsights(
    schema: SDQLQueryWrapper,
  ): ResultAsync<void, QueryFormatError> {
    const insightSchema = schema.getInsightSchema();
    if (insightSchema == null || Object.keys(insightSchema).length == 0) {
      return okAsync(undefined);
    }
    return ResultUtils.combine(
      (Array.from(Object.keys(insightSchema)) as InsightKey[]).map((iKey) => {
        return this.validateInsight(iKey, insightSchema[iKey]);
      }),
    )
      .mapErr((e) => e)
      .map(() => {});
  }

  private validateInsight(
    iKey: InsightKey,
    i: ISDQLInsightBlock,
  ): ResultAsync<void, QueryFormatError> {
    if (i.name == null || i.returns == null) {
      return errAsync(new QueryFormatError(`Corrupted insight: ${iKey}`));
    }
    return okAsync(undefined);
  }

  private validateCompensations(
    schema: SDQLQueryWrapper,
  ): ResultAsync<void, QueryFormatError> {
    const compSchema = schema.getCompensationSchema();
    if (compSchema == null || Object.keys(compSchema).length == 0) {
      return okAsync(undefined);
    }
    return ResultUtils.combine(
      (Array.from(Object.keys(compSchema)) as CompensationKey[]).map((cKey) => {
        if (cKey == "parameters") {
          return okAsync(undefined);
        }
        return this.validateCompensation(
          cKey,
          compSchema[cKey] as ISDQLCompensations,
        );
      }),
    )
      .mapErr((e) => e)
      .map(() => {});
  }

  private validateCompensation(
    cKey: CompensationKey,
    c: ISDQLCompensations,
  ): ResultAsync<void, QueryFormatError> {
    if (
      c.name == null ||
      c.image == null ||
      c.description == null ||
      c.chainId == null ||
      c.callback.parameters == null ||
      c.callback.data.trackingId == null
    ) {
      return errAsync(new QueryFormatError(`Corrupted compensation: ${cKey}`));
    }
    return okAsync(undefined);
  }
  // #endregion

  private parse(): ResultAsync<
    void,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
  > {
    return this.parseQueries().andThen(() => {
      return ResultUtils.combine([
        this.parseAds(),
        this.parseInsights(),
      ]).andThen(() => {
        return this.parseCompensations();
      });
    });
  }

  // #region non-logic
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

  private parseAds(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {
    const adsSchema = this.schema.getAdsSchema();
    if (!adsSchema) {
      return okAsync(undefined);
    }

    return ResultUtils.combine(
      Array.from(Object.keys(adsSchema)).map((adKey) => {
        return this.parseAd(SDQL_Name(adKey), adsSchema[adKey]);
      }),
    ).map((ads) => {
      ads.forEach((ad) => {
        this.ads.set(ad.name, ad);
        this.saveInContext(ad.name, ad);
      });
    });
  }

  private parseAd(
    adKey: SDQL_Name,
    ad: ISDQLAd,
  ): ResultAsync<
    AST_Ad,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {
    return this.parseLogicExpString(ad.target!)
      .mapErr((err) => {
        return this.transformError(err as Error);
      })
      .map((adTarget) => {
        return new AST_Ad(
          adKey,
          SDQL_Name(ad.name),
          ad.content,
          ad.text,
          ad.displayType,
          ad.weight,
          ad.expiry,
          ad.keywords,
          adTarget,
          ad.target!,
        );
      });
  }

  private parseInsights(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {
    const insightSchema = this.schema.getInsightSchema();
    if (!insightSchema) {
      return okAsync(undefined);
    }

    return ResultUtils.combine(
      Array.from(Object.keys(insightSchema)).map((iName) => {
        return this.parseInsight(SDQL_Name(iName), insightSchema[iName]);
      }),
    ).map((insights) => {
      insights.forEach((insight) => {
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
      this.parseLogicExpString(schema.target!),
      this.exprParser!.parse(schema.returns),
    ])
      .mapErr((error) => {
        return this.transformError(error);
      })
      .map(([targetAst, returnsAst]) => {
        return new AST_Insight(
          name,
          targetAst as AST_ConditionExpr,
          schema.target!,
          returnsAst as AST_Expr,
          schema.returns,
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
        this.compensationParameters = compensationSchema[
          cName
        ] as ISDQLCompensationParameters;
      } else {
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
    return this.exprParser!.parse(schema.requires!)
      .mapErr((error) => {
        return this.transformError(error);
      })
      .map((ast) => {
        return new AST_Compensation(
          name,
          schema.description,
          ast as AST_RequiresExpr,
          schema.requires!,
          schema.chainId,
          schema.callback,
          schema.alternatives ? schema.alternatives : [],
        );
      });
  }

  private saveInContext(name: string, val: ParserContextDataTypes): void {
    if (this.context.has(name)) {
      throw new DuplicateIdInSchema(name);
    }
    this.context.set(name, val);
  }
  // #endregion

  // #region Logic
  private parseLogicExpString(
    target: string,
  ): ResultAsync<AST_ConditionExpr, ParserError | InvalidRegularExpression> {
    return this.exprParser!.parse(target).andThen((ast) => {
      if (ast instanceof AST_ConditionExpr) {
        return okAsync(ast);
      }
      if (ast instanceof AST_BoolExpr) {
        return okAsync(
          new AST_ConditionExpr(
            ast.name,
            (ast.source as Condition | AST_SubQuery | boolean) || false,
          ),
        );
      }
      if (ast instanceof AST_Expr && ast.source instanceof AST_SubQuery) {
        return okAsync(new AST_ConditionExpr(ast.name, ast.source));
      }
      if (ast instanceof Condition) {
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
  // #endregion

  private transformError(
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
}
