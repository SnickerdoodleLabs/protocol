import { SDQLParser } from "@query-parser/implementations/business/SDQLParser";
import {
  AST_Ad,
  AST_Compensation,
  AST_Expr,
  AST_Query,
  AST_ReturnExpr,
  Command,
  Command_IF,
  ISDQLParserFactory,
  ISDQLParserFactoryType,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
} from "@query-parser/interfaces/index.js";
import {
  AdKey,
  CompensationId,
  DataPermissions,
  DuplicateIdInSchema,
  IpfsCID,
  ISDQLAd,
  ISDQLCompensations,
  ISDQLReturn,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFilteredByPermissions,
  QueryFormatError,
  QueryIdentifier,
  ReturnKey,
  SDQLString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class SDQLQueryUtils {
  public constructor(
    @inject(ISDQLParserFactoryType)
    protected parserFactory: ISDQLParserFactory,
    @inject(ISDQLQueryWrapperFactoryType)
    readonly queryWrapperFactory: ISDQLQueryWrapperFactory,
  ) {}

  public getEligibleCompensations(
    schemaString: SDQLString,
    queryIds: QueryIdentifier[],
  ): ResultAsync<
    CompensationId[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.parseAndBuildAst(schemaString).map((parser) => {
      return this.getAllExpectedCompensationsIds(
        parser,
        this.getPermittedReturnKeys(parser, queryIds),
        this.getPermittedAdKeys(parser, queryIds),
      );
    });
  }

  public filterQueryByPermissions(
    schemaString: SDQLString,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    QueryFilteredByPermissions,
    | QueryFormatError
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.parseAndBuildAst(schemaString).andThen((parser) => {
      return this.getPermittedQueryIds(parser, dataPermissions).map(
        (permittedQueryIds) => {
          const permittedAds = this.getPermittedAdKeys(
            parser,
            permittedQueryIds,
          );
          const permittedReturns = this.getPermittedReturnKeys(
            parser,
            permittedQueryIds,
          );

          const expectedCompensationIds = this.getAllExpectedCompensationsIds(
            parser,
            permittedReturns,
            permittedAds,
          );

          return new QueryFilteredByPermissions(
            Array.from(permittedQueryIds),
            this.buildEligibleReturnsMap(parser, permittedReturns),
            this.buildExpectedCompsMap(parser, expectedCompensationIds),
            this.buildEligibleAdsMap(parser, permittedAds),
          );
        },
      );
    });
  }

  public getPermittedQueryIdsFromSchemaString(
    schemaString: SDQLString,
    givenPermissions: DataPermissions,
  ): ResultAsync<
    QueryIdentifier[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.parseAndBuildAst(schemaString).andThen((parser) => {
      return this.getPermittedQueryIds(parser, givenPermissions);
    });
  }

  public getPermittedQueryIds(
    parser: SDQLParser,
    givenPermissions: DataPermissions,
  ): ResultAsync<
    QueryIdentifier[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    // for each query, check if permission is given
    const checks = this.getQueryPermissionChecks(parser, givenPermissions);
    return ResultUtils.combine(checks).andThen((resultIds) => {
      return okAsync(
        resultIds.reduce<QueryIdentifier[]>((acc, next) => {
          if (next != null) {
            acc.push(QueryIdentifier(next));
          }
          return acc;
        }, []),
      );
    });
  }

  protected getQueryPermissionChecks(
    parser: SDQLParser,
    givenPermissions: DataPermissions,
  ): ResultAsync<SDQL_Name | null, never>[] {
    /// returns an array of check results where each check resolves to a queryId if permmission is given or null otherwise.
    const checks: ResultAsync<SDQL_Name | null, never>[] = [];
    for (const [queryId, query] of parser.queries) {
      checks.push(this.queryIdIfPermitted(parser, query, givenPermissions));
    }

    return checks;
  }

  protected queryIdIfPermitted(
    parser: SDQLParser,
    query: AST_Query,
    givenPermissions: DataPermissions,
  ): ResultAsync<SDQL_Name | null, never> {
    const flag = parser.getQueryPermissionFlag(query);
    if (flag.isOk() && givenPermissions.getFlag(flag.value)) {
      return okAsync(query.name);
    }
    return okAsync(null);
  }

  private getPermittedAdKeys(
    parser: SDQLParser,
    permittedQueryIds: QueryIdentifier[],
  ): AdKey[] {
    const permittedQueryIdSet = new Set(permittedQueryIds);
    return Array.from(parser.ads.values())
      .filter((ad) =>
        this.areLogicDepsPermitted(permittedQueryIdSet, parser, ad.logic),
      )
      .map((ad) => AdKey(ad.key));
  }

  private getPermittedReturnKeys(
    parser: SDQLParser,
    permittedQueryIds: QueryIdentifier[],
  ): ReturnKey[] {
    const permittedReturnKeys = new Set<ReturnKey>();
    const permittedQueryIdSet = new Set(permittedQueryIds);
    parser.returns!.expressions.forEach((expr, returnKey) => {
      if (this.areLogicDepsPermitted(permittedQueryIdSet, parser, expr.logic)) {
        permittedReturnKeys.add(ReturnKey(returnKey));
      }
    });
    return Array.from(permittedReturnKeys);
  }

  private areLogicDepsPermitted(
    permittedQueryIds: Set<string>,
    parser: SDQLParser,
    logicExpr: string,
  ): boolean {
    return this.getQueryDependenciesFromLogicExpr(parser, logicExpr).every(
      (dep) => permittedQueryIds.has(dep),
    );
  }

  private getQueryDependenciesFromLogicExpr(
    parser: SDQLParser,
    logicExpr: string,
  ): QueryIdentifier[] {
    return parser
      .parseQueryDependencies(logicExpr)
      .map((dep) => QueryIdentifier(dep.name));
  }

  private buildEligibleAdsMap(
    parser: SDQLParser,
    permittedAdKeys: AdKey[],
  ): Map<AdKey, ISDQLAd> {
    const eligibleAdBlocks: Map<AdKey, ISDQLAd> = new Map();
    const permittedAdKeysSet = new Set(permittedAdKeys);
    const adSchema = parser.schema.getAdsSchema();
    for (const adKey in adSchema) {
      if (permittedAdKeysSet.has(AdKey(adKey))) {
        eligibleAdBlocks[adKey] = adSchema[adKey] as ISDQLAd;
      }
    }
    return eligibleAdBlocks;
  }

  private buildEligibleReturnsMap(
    parser: SDQLParser,
    permittedReturnKeys: ReturnKey[],
  ): Map<ReturnKey, ISDQLReturn> {
    const eligibleReturnBlocks: Map<ReturnKey, ISDQLReturn> = new Map();
    const permittedReturnKeysSet = new Set(permittedReturnKeys);
    const returnSchema = parser.schema.getReturnSchema();
    for (const returnKey in returnSchema) {
      if (typeof returnSchema[returnKey] === "string") {
        continue;
      }
      if (permittedReturnKeysSet.has(ReturnKey(returnKey))) {
        eligibleReturnBlocks[returnKey] = returnSchema[
          returnKey
        ] as ISDQLReturn;
      }
    }
    return eligibleReturnBlocks;
  }

  private buildExpectedCompsMap(
    parser: SDQLParser,
    expectedCompensationIds: CompensationId[],
  ): Map<CompensationId, ISDQLCompensations> {
    const expectedCompensationBlocks: Map<CompensationId, ISDQLCompensations> =
      new Map();
    const expectedCompensationIdsSet = new Set(expectedCompensationIds);
    const compensationSchema = parser.schema.getCompensationSchema();
    for (const compensationKey in compensationSchema) {
      if (expectedCompensationIdsSet.has(CompensationId(compensationKey))) {
        expectedCompensationBlocks[compensationKey] = compensationSchema[
          compensationKey
        ] as ISDQLCompensations;
      }
    }
    return expectedCompensationBlocks;
  }

  private getAllExpectedCompensationsIds(
    parser: SDQLParser,
    permittedReturnKeys: ReturnKey[],
    permittedAdKeys: AdKey[],
  ): CompensationId[] {
    return [
      ...this.getExpectedCompIdsByReturnKeys(parser, permittedReturnKeys),
      ...this.getExpectedCompIdsByAdKeys(parser, permittedAdKeys),
    ];
  }

  private getExpectedCompIdsByAdKeys(
    parser: SDQLParser,
    adKeys: AdKey[],
  ): CompensationId[] {
    const adCompensationIds = new Set<CompensationId>();

    parser.logicCompensations.forEach((comAst, compExpr) => {
      const adDependencies = parser.parseAdDependencies(compExpr);
      if (
        adDependencies.length > 0 && // Is an ad compensation
        this.areAllAdDepsPermitted(adKeys, adDependencies)
      ) {
        const comIds = this.extractCompensationIdFromAstWithAlternatives(
          comAst!,
        );
        comIds.forEach((comId) => adCompensationIds.add(comId));
      }
    });

    return Array.from(adCompensationIds);
  }

  private getExpectedCompIdsByReturnKeys(
    parser: SDQLParser,
    returnKeys: ReturnKey[],
  ): CompensationId[] {
    const returnCompIds = new Set<CompensationId>();

    parser.logicCompensations.forEach((comAst, compExpr) => {
      const returnDependencies = parser.parseReturnDependencies(compExpr);
      if (
        returnDependencies.length > 0 &&
        this.areAllReturnDepsPermitted(returnKeys, returnDependencies)
      ) {
        const comIds = this.extractCompensationIdFromAstWithAlternatives(
          comAst!,
        );
        comIds.forEach((comId) => returnCompIds.add(comId));
      }
    });

    return Array.from(returnCompIds);
  }

  private areAllReturnDepsPermitted(
    permittedReturnKeys: ReturnKey[],
    returnDependencies: AST_ReturnExpr[],
  ): boolean {
    return returnDependencies.every((ret) =>
      permittedReturnKeys.includes(ReturnKey(ret.name)),
    );
  }

  private areAllAdDepsPermitted(
    permittedAdKeys: AdKey[],
    adDependencies: AST_Ad[],
  ): boolean {
    return adDependencies.every((ad) =>
      permittedAdKeys.includes(AdKey(ad.key)),
    );
  }

  private extractCompensationIdFromAstWithAlternatives(
    ast: AST_Expr | Command,
  ): Set<CompensationId> {
    const comIds = new Set<CompensationId>();
    const compensationAst = this.getCompensationAstFromAst(ast);
    comIds.add(CompensationId(compensationAst.name as string));
    for (const altId of compensationAst.alternatives) {
      comIds.add(altId);
    }
    return comIds;
  }

  private getCompensationAstFromAst(ast: AST_Expr | Command): AST_Compensation {
    switch (ast.constructor) {
      case Command_IF:
        return this.getCompensationAstFromAst((ast as Command_IF).trueExpr);
      case AST_Compensation:
        return ast as AST_Compensation;
      default:
        console.error(
          "getCompensationAstFromAst: Unknown expression to extract compensation from.",
          ast,
        );
        throw new QueryFormatError(
          "Unknown expression to extract compensation from.",
        );
    }
  }

  private parseAndBuildAst(
    schemaString: SDQLString,
  ): ResultAsync<
    SDQLParser,
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.parserFactory
      .makeParser(IpfsCID(""), schemaString)
      .andThen((parser) => {
        return parser.buildAST().map(() => parser);
      });
  }
}
