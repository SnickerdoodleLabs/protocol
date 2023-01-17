import {
  CompensationKey,
  DataPermissions,
  DuplicateIdInSchema,
  IpfsCID,
  AdKey,
  ISDQLAd,
  ISDQLCompensations,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFormatError,
  QueryIdentifier,
  SDQLString,
  SDQL_Name,
  QueryFilteredByPermissions,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { SDQLParser } from "@query-parser/implementations/business/SDQLParser";
import {
  AST_Ad,
  AST_Compensation,
  AST_Expr,
  AST_Query,
  Command,
  Command_IF,
  ISDQLParserFactory,
  ISDQLParserFactoryType,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
} from "@query-parser/interfaces/index.js";

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
    CompensationKey[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.parserFactory.makeParser(IpfsCID(""), schemaString).andThen((parser) => {
      return parser.buildAST().map(() => {
        const permittedAdKeys = this.getPermittedAdKeysByPermittedQueryIds(parser, queryIds);
        const expectedCompensationKeys = this.getAllExpectedCompensationsIds(parser, queryIds, permittedAdKeys);
        return expectedCompensationKeys;
      });
    });
  }

  public filterQueryByPermissions(
    schemaString: SDQLString,
    dataPermissions: DataPermissions
  ): ResultAsync<
    QueryFilteredByPermissions, 
    QueryFormatError 
    | ParserError 
    | DuplicateIdInSchema 
    | MissingTokenConstructorError 
    | QueryExpiredError
  > {

    return this.parserFactory.makeParser(IpfsCID(""), schemaString).andThen((parser) => {
      return parser.buildAST().andThen(() => {
        return this.getPermittedQueryIds(parser, dataPermissions).map((permittedQueryIds) => {

          const permittedAdKeys = this.getPermittedAdKeysByPermittedQueryIds(
            parser, permittedQueryIds
          );
          const eligibleAdsMap = this.buildEligibleAdsMap(
            parser, permittedAdKeys
          );
          const expectedCompensationKeys = this.getAllExpectedCompensationsIds(
            parser, permittedQueryIds, permittedAdKeys
          );
          const expectedCompensationsMap = this.buildExpectedCompensationsMap(
            parser, expectedCompensationKeys
          );
          return new QueryFilteredByPermissions(
            permittedQueryIds,
            expectedCompensationsMap,
            eligibleAdsMap
          );
        });
      });
    });
  }

  private buildEligibleAdsMap(
    parser: SDQLParser,
    permittedAdKeys: AdKey[]
  ): Map<AdKey, ISDQLAd> {

    const eligibleAdBlocks: Map<AdKey, ISDQLAd> = new Map();

    const adSchema = parser.schema.getAdsSchema();
    for (const adKey in adSchema) {
      if (!permittedAdKeys.includes(AdKey(adKey))) {
        continue;
      }
      eligibleAdBlocks[adKey] = adSchema[adKey] as ISDQLCompensations;
    }

    return eligibleAdBlocks;
  }

  private buildExpectedCompensationsMap(
    parser: SDQLParser,
    expectedCompensationKeys: CompensationKey[]
  ): Map<CompensationKey, ISDQLCompensations> {

    const expectedCompensationBlocks: Map<CompensationKey, ISDQLCompensations> = new Map();

    const compensationSchema = parser.schema.getCompensationSchema();
    for (const compensationKey in compensationSchema) {
      if (!expectedCompensationKeys.includes(CompensationKey(compensationKey))) {
        continue;
      }
      expectedCompensationBlocks[compensationKey] = // 'c1': ISDQLCompensations object
          compensationSchema[compensationKey] as ISDQLCompensations;
    }

    return expectedCompensationBlocks;
  }

  private getAllExpectedCompensationsIds(
    parser: SDQLParser,
    permittedQueryIds: QueryIdentifier[],
    permittedAdKeys: AdKey[]
  ): CompensationKey[] {

    const queryCompensations = 
      this.getExpectedCompensationKeysByQueryIds(parser, permittedQueryIds);
    const adCompensations = 
      this.getExpectedCompensationKeysByAdKeys(parser, permittedAdKeys);

    return Array.from( new Set( queryCompensations.concat(adCompensations) ) )
  }

  private getExpectedCompensationKeysByQueryIds(
    parser: SDQLParser,
    queryIds: string[]
  ): CompensationKey[] {
    const queryPermissions = 
      parser.queryIdsToDataPermissions(queryIds);

    const queryCompensationKeys = new Set<CompensationKey>();
    parser.compensationPermissions.forEach((comPermissions, compExpr) => {

      const adDependencies = parser.parseAdDependencies(compExpr);
      if (
        adDependencies.length == 0 && // Is a query compensation
        queryPermissions.contains(comPermissions!)
      ) {

        const comAst = parser.logicCompensations.get(compExpr);
        const comIds = this.extractCompensationKeyFromAstWithAlternatives(comAst!);

        comIds.forEach((comId) => queryCompensationKeys.add(comId));
      }
    });

    return Array.from(queryCompensationKeys);
  }

  protected extractCompensationKeyFromAst(
    ast: AST_Expr | Command,
  ): CompensationKey {
    // console.log("extractCompensationKeyFromAst: ast", ast);
    const compensationAst = this.getCompensationAstFromAst(ast);
    return CompensationKey(compensationAst.name as string);
  }

  protected extractCompensationKeyFromAstWithAlternatives(
    ast: AST_Expr | Command,
  ): Set<CompensationKey> {
    // console.log("extractCompensationKeyFromAst: ast", ast);
    const comIds = new Set<CompensationKey>();
    const compensationAst = this.getCompensationAstFromAst(ast);
    comIds.add(CompensationKey(compensationAst.name as string));
    for (const altId of compensationAst.alternatives) {
      comIds.add(altId);
    }

    return comIds;
  }

  protected getCompensationAstFromAst(
    ast: AST_Expr | Command,
  ): AST_Compensation {
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

  public getExpectedCompensationKeysByEligibleAdKeys(
    parser: SDQLParser,
    eligibleAdKeys: AdKey[]
  ): CompensationKey[] {
    return this.getExpectedCompensationKeysByAdKeys(parser, eligibleAdKeys);
  }

  public getExpectedCompensationKeysBySeenAdKeys(
    parser: SDQLParser,
    seenAdKeys: AdKey[]
  ): CompensationKey[] {
    return this.getExpectedCompensationKeysByAdKeys(parser, seenAdKeys);
  }

  public getExpectedCompensationKeysByAdKeys(
    parser: SDQLParser,
    adKeys: AdKey[]
  ): CompensationKey[] {

    const adCompensationKeys = new Set<CompensationKey>();

    parser.logicCompensations.forEach((comAst, compExpr) => {
      const adDependencies = parser.parseAdDependencies(compExpr);
      if (
        adDependencies.length > 0 && // Is an ad compensation
        this.adListContainsAllAdDependencies(adKeys, adDependencies)
      ) {

        const comIds = this.extractCompensationKeyFromAstWithAlternatives(comAst!);
        comIds.forEach((comId) => adCompensationKeys.add(comId));
      }
    });

    return Array.from(adCompensationKeys);
  }

  private getPermittedAdKeysByPermittedQueryIds(
    parser: SDQLParser,
    permittedQueryIds: string[]
  ): AdKey[] {
    const permittedAdKeys = new Set<AdKey>();

    const queryPermissions = parser.queryIdsToDataPermissions(permittedQueryIds);
    parser.adPermissions.forEach((adPermissions, adLogicExpr) => {
      if (queryPermissions.contains(adPermissions!)) {
        const adAstExpr = parser.logicAds.get(adLogicExpr);
        const adAst = this.getAdAstFromAst(adAstExpr!);

        permittedAdKeys.add(AdKey(adAst.key));
      }
    });

    return Array.from(permittedAdKeys);
  }

  protected getAdAstFromAst(
    ast: AST_Expr | Command,
  ): AST_Ad {
    switch (ast.constructor) {
      case Command_IF:
        return this.getAdAstFromAst((ast as Command_IF).trueExpr);
      case AST_Ad:
        return ast as AST_Ad;
      default:
        console.error(
          "getAdAstFromAst: Unknown expression to extract ad from.",
          ast,
        );
        throw new QueryFormatError(
          "Unknown expression to extract ad from.",
        );
    }
  }

  private adListContainsAllAdDependencies (
    permittedAdKeys: string[],
    adDependencies: AST_Ad[]
  ): boolean {
    return adDependencies.every(ad => permittedAdKeys.includes(ad.key));
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
    return this.parserFactory
      .makeParser(IpfsCID(""), schemaString)
      .andThen((parser) => {
        return this.extractPermittedQueryIdsFromParser(parser, givenPermissions);
      });
  }

  public extractPermittedQueryIdsFromParser(
    parser: SDQLParser,
    dataPermissions: DataPermissions
  ): ResultAsync<
    QueryIdentifier[],
    QueryFormatError 
    | ParserError
    | MissingTokenConstructorError 
    | QueryExpiredError
  > {

    return parser.buildAST().andThen(
      () => this.getPermittedQueryIds(parser, dataPermissions)
    );
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
    if (givenPermissions.getFlag(flag)) {
      return okAsync(query.name);
    }
    return okAsync(null);
  }

  private getDependenciesByCompensationKey(
    parser: SDQLParser,
    compId : CompensationKey
  ): (AST_Ad|AST_Query)[][] {

    const resultingArray: (AST_Ad|AST_Query)[][] = [];

    for (const [compExpr, comAst] of parser.logicCompensations) {
      const comIdFromExpression = this.extractCompensationKeyFromAst(comAst!);
      if (compId != comIdFromExpression) {
        continue;
      }

      const adDependencies = parser.parseAdDependencies(compExpr);
      if (adDependencies.length > 0) {
        resultingArray.push(adDependencies);
      } else {
        const queryDependencies = parser.parseQueryDependencies(compExpr);
        resultingArray.push(queryDependencies);
      }
    }

    return resultingArray;
  }
}
