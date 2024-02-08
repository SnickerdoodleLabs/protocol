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
  ISDQLQuestions,
  ISDQLInsightBlock,
  ISDQLQuestionParameters,
  MissingASTError,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFormatError,
  SDQL_Name,
  URLString,
  Version,
  EQuestionType,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { DependencyParser } from "@query-parser/implementations/business/DependencyParser.js";
import { ExprParser } from "@query-parser/implementations/business/ExprParser.js";
import {
  AST,
  AST_Ad,
  AST_BalanceQuery,
  AST_BoolExpr,
  AST_Compensation,
  AST_ConditionExpr,
  AST_Expr,
  AST_Insight,
  AST_PropertyQuery,
  AST_Question,
  AST_RequireExpr,
  AST_SubQuery,
  AST_Web3Query,
  Condition,
  IQueryObjectFactory,
  ParserContextDataTypes,
  SDQLQueryWrapper,
  AST_MCQuestion, 
  AST_TextQuestion, 
} from "@query-parser/interfaces/index.js";

export class SDQLParser {
  public context = new Map<string, ParserContextDataTypes>();
  public exprParser: ExprParser;
  public dependencyParser: DependencyParser;

  public queries = new Map<SDQL_Name, AST_SubQuery>();
  public ads = new Map<SDQL_Name, AST_Ad>();
  public insights = new Map<SDQL_Name, AST_Insight>();
  public compensations = new Map<SDQL_Name, AST_Compensation>();
  public compensationParameters: ISDQLCompensationParameters | null = null;

  public questions = new Map<SDQL_Name, AST_Question>();
  public questionParameters: ISDQLQuestionParameters | null = null;


  constructor(
    readonly cid: IpfsCID,
    readonly schema: SDQLQueryWrapper,
    readonly queryObjectFactory: IQueryObjectFactory,
  ) {
    this.exprParser = new ExprParser(this.context);
    this.dependencyParser = new DependencyParser();
  }

  public buildQuestionnaireAST(): 
  ResultAsync<
    AST,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
  > {
    console.log("inside build ast");
    return this.validateQuestionnaireSchema(this.schema, this.cid).andThen(() => {
      return this.parse().map(() => {
        console.log("this.schema: " + JSON.stringify(this.schema));
        console.log("this.cid: " + this.cid);
        console.log("this.questions: " + JSON.stringify(this.questions));
        const ast = new AST(
          Version(this.schema.version!),
          this.schema.description!,
          this.schema.business!,
          this.ads!,
          this.queries!,
          this.insights,
          this.compensationParameters,
          this.compensations,
          this.questions,
          this.schema.timestamp!,
        );
        console.log("ast: " + JSON.stringify(ast));
        return ast;
      });
    });
  }

  public buildAST(): ResultAsync<
    AST,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | MissingASTError
  > {
    console.log("inside build ast");
    return this.validateSchema(this.schema, this.cid).andThen(() => {
      return this.parse().map(() => {
        console.log("this.schema: " + JSON.stringify(this.schema));
        console.log("this.cid: " + this.cid);

        return new AST(
          Version(this.schema.version!),
          this.schema.description,
          this.schema.business,
          this.ads,
          this.queries,
          this.insights,
          this.compensationParameters,
          this.compensations,
          this.questions,
          this.schema.timestamp!,
        );
      });
    });
  }

  public validateQuestionnaireSchema(
    schema: SDQLQueryWrapper,
    cid: IpfsCID,
  ): ResultAsync<void, QueryFormatError | QueryExpiredError> {
    return ResultUtils.combine([
      // this.validateMeta(schema),
      // this.validateTimestampExpiry(schema, cid),
      this.validateQuestions()
    ])
      .mapErr((e) => e)
      .map(() => {});
  }

  private validateQuestions(): ResultAsync<void, QueryFormatError | QueryExpiredError> {
    const questionsToValidate: ResultAsync<void, QueryFormatError>[] = [];
    this.schema
      .getCompensationEntries()
      .forEach((compensation, compensationKey) => {
        if (compensationKey == "parameters") {
          return questionsToValidate.push(okAsync(undefined));
        }
        return this.validateCompensation(compensationKey, compensation);
      });

    return ResultUtils.combine(questionsToValidate).map(() => {});
  }


  // #region schema validation
  public validateSchema(
    schema: SDQLQueryWrapper,
    cid: IpfsCID,
  ): ResultAsync<void, QueryFormatError | QueryExpiredError> {
    return ResultUtils.combine([
      this.validateMeta(schema),
      this.validateTimestampExpiry(schema, cid),
      this.validateAds(),
      this.validateInsights(),
      this.validateCompensations(),
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
    console.log("schema: " + JSON.stringify(schema));
    console.log("cid: " + cid);
    console.log("schema.expiry: " + (schema.expiry));
    console.log("schema.isExpired: " + (schema.isExpired()));



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
        new QueryExpiredError(
          `Tried to execute an expired query with CID ${cid}`,
          null,
        ),
      );
    }
    return okAsync(undefined);
  }

  private validateAds(): ResultAsync<void, QueryFormatError> {
    return ResultUtils.combine(
      this.schema.getAdEntries().map(([adKey, ad]) => {
        return this.validateAd(adKey, ad);
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

  private validateInsights(): ResultAsync<void, QueryFormatError> {
    return ResultUtils.combine(
      this.schema.getInsightEntries().map(([iKey, insight]) => {
        return this.validateInsight(iKey, insight);
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

  private validateCompensations(): ResultAsync<void, QueryFormatError> {
    const compsToValidate: ResultAsync<void, QueryFormatError>[] = [];
    this.schema
      .getCompensationEntries()
      .forEach((compensation, compensationKey) => {
        if (compensationKey == "parameters") {
          return compsToValidate.push(okAsync(undefined));
        }
        return this.validateCompensation(compensationKey, compensation);
      });

    return ResultUtils.combine(compsToValidate).map(() => {});
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
      return errAsync(
        new QueryFormatError(
          `Query CID:${this.cid} Corrupted compensation: ${cKey}`,
        ),
      );
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
    | MissingASTError
  > {
    return this.parseQueries().andThen(() => {
      return ResultUtils.combine([
        this.parseAds(),
        this.parseInsights(),
        this.parseQuestions(),
      ]).andThen(() => {
        return this.parseCompensations();
      });
    });
  }

  // #region non-logic
  private parseQueries(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
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
    return ResultUtils.combine(
      this.schema.getAdEntries().map(([adKey, ad]) => {
        return this.parseAd(SDQL_Name(adKey), ad);
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
    return ResultUtils.combine(
      this.schema.getInsightEntries().map(([iKey, insight]) => {
        return this.parseInsight(SDQL_Name(iKey), insight);
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
          schema.name,
          schema.description,
          ast as AST_RequireExpr,
          schema.requires!,
          schema.chainId,
          schema.callback,
          schema.alternatives ? schema.alternatives : [],
          schema.image ? schema.image : URLString(""),
        );
      });
  }

    private parseQuestions(): ResultAsync<
    void,
    DuplicateIdInSchema | QueryFormatError | MissingASTError
  > {

    try {
      const questionnaireSchema = this.schema.getQuestionSchema();
      console.log("questionnaireSchema: " + JSON.stringify(questionnaireSchema));
      const questions = new Array<
        AST_MCQuestion | AST_TextQuestion 
      >();
      for (const qName in questionnaireSchema) {
        const questionName = SDQL_Name(qName);
        console.log("questionName: " + questionName);
        const schema = questionnaireSchema[qName];
        const questionType = schema.questionType;
        const questionQ = schema.question;
        const questionOptions = schema.options;
        if (questionType != EQuestionType.multipleChoice) {
          questions.push(AST_TextQuestion.fromSchema(questionName, schema));
        } else {
          questions.push(AST_MCQuestion.fromSchema(questionName, schema));
        }
      }
      console.log("questions: " + questions);
      for (const question of questions) {
        this.saveInContext(question.name, question);
        this.questions.set(question.name, question);
      }
      console.log("this.questions: " + JSON.stringify(this.questions));
      return okAsync(undefined);
    } catch (err) {
      return errAsync(this.transformError(err as Error));
    }
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
  ): ResultAsync<
    AST_ConditionExpr,
    ParserError | InvalidRegularExpression | QueryFormatError
  > {
    return this.exprParser!.parse(target).andThen((ast) => {
      if (ast instanceof AST_ConditionExpr) {
        return okAsync(ast);
      }
      if (ast instanceof AST_BoolExpr) {
        return okAsync(
          new AST_ConditionExpr(
            ast.name,
            ast.source == null
              ? false
              : (ast.source as Condition | AST_SubQuery | boolean),
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

  public getQueryDependencies(
    expr: AST_RequireExpr,
    possibleInsightsAndAds?: (InsightKey | AdKey)[],
  ): ResultAsync<Set<AST_SubQuery>, MissingASTError> {
    return this.dependencyParser.getQueryDependencies(
      expr,
      possibleInsightsAndAds,
    );
  }
}
