import {
  AdId,
  CompensationId,
  DataPermissions,
  DuplicateIdInSchema,
  IpfsCID,
  ISDQLCompensations,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFormatError,
  QueryIdentifier,
  SDQLString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";
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
    queryIds: string[],
  ): ResultAsync<
    CompensationId[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.parserFactory.makeParser(IpfsCID(""), schemaString)
    .andThen((parser) => {

      return parser.buildAST()
      .andThen(() => okAsync(
        this.getAllExpectedCompensationsIds(parser, queryIds)
      ));
    });
  }

  public extractPermittedQueryIdsAndExpectedCompensationBlocks(
    schemaString: SDQLString,
    dataPermissions: DataPermissions
  ): ResultAsync<
    [string[], Map<string, ISDQLCompensations>], 
    QueryFormatError 
    | ParserError 
    | DuplicateIdInSchema 
    | MissingTokenConstructorError 
    | QueryExpiredError
  > {

    return this.parserFactory.makeParser(IpfsCID(""), schemaString)
    .andThen((parser) => {

      return parser.buildAST().andThen(() => {

        return this.getPermittedQueryIds(parser, dataPermissions)
        .andThen((permittedQueryIds) => {

          const expectedCompensationIds = 
            this.getAllExpectedCompensationsIds(parser, permittedQueryIds)
          // console.log("expectedCompensationIds: " + expectedCompensationIds);

          const expectedCompensationBlocks: Map<string, ISDQLCompensations> = new Map();

          const compensationSchema = parser.schema.getCompensationSchema();
          for (const compensationName in compensationSchema) {
            if (!expectedCompensationIds.includes(CompensationId(compensationName)))
              continue;

            expectedCompensationBlocks[compensationName] = // 'c1': ISDQLCompensations object
                compensationSchema[compensationName] as ISDQLCompensations;
          }
          
          return okAsync<[string[], Map<string, ISDQLCompensations>]>(
            [permittedQueryIds, expectedCompensationBlocks]
          );
        });
      });
    });
  }

  private getAllExpectedCompensationsIds(
    parser: SDQLParser,
    permittedQueryIds: string[]
  ): CompensationId[] {

    const queryCompensations = 
      this.getExpectedCompensationIdsByQueryIds(parser, permittedQueryIds);

    const permittedAdIds = 
      this.getPermittedAdIdsByPermittedQueryIds(parser, permittedQueryIds);
    const adCompensations = 
      this.getExpectedCompensationIdsByAdIds(parser, permittedAdIds);

    // console.log("queryCompensations: " + queryCompensations);
    // console.log("permittedAdIds: " + permittedAdIds);
    // console.log("adCompensations: " + adCompensations);

    return Array.from( new Set( queryCompensations.concat(adCompensations) ) )
  }

  private getExpectedCompensationIdsByAdIds(
    parser: SDQLParser,
    adIds: string[]
  ): CompensationId[] {

    const adCompensationIds = new Set<CompensationId>();

    parser.logicCompensations.forEach((comAst, compExpr) => {
      const adDependencies = parser.parseAdDependencies(compExpr);
      if (
        adDependencies.length > 0 && // Is an ad compensation
        this.adListContainsAllAdDependencies(adIds, adDependencies)
      ) {

        const comIds = this.extractCompensationIdFromAstWithAlternatives(comAst!);
        comIds.forEach((comId) => adCompensationIds.add(comId));
      }
    });

    return Array.from(adCompensationIds);
  }

  private getExpectedCompensationIdsByQueryIds(
    parser: SDQLParser,
    queryIds: string[]
  ): CompensationId[] {
    const queryPermissions = 
      parser.queryIdsToDataPermissions(queryIds);

    const queryCompensationIds = new Set<CompensationId>();
    parser.compensationPermissions.forEach((comPermissions, compExpr) => {

      const adDependencies = parser.parseAdDependencies(compExpr);
      if (
        adDependencies.length == 0 && // Is a query compensation
        queryPermissions.contains(comPermissions!)
      ) {

        const comAst = parser.logicCompensations.get(compExpr);
        const comIds = this.extractCompensationIdFromAstWithAlternatives(comAst!);

        comIds.forEach((comId) => queryCompensationIds.add(comId));
      }
    });

    return Array.from(queryCompensationIds);
  }

  protected extractCompensationIdFromAst(
    ast: AST_Expr | Command,
  ): CompensationId {
    // console.log("extractCompensationIdFromAst: ast", ast);
    const compensationAst = this.getCompensationAstFromAst(ast);
    return CompensationId(compensationAst.name as string);
  }

  protected extractCompensationIdFromAstWithAlternatives(
    ast: AST_Expr | Command,
  ): Set<CompensationId> {
    // console.log("extractCompensationIdFromAst: ast", ast);
    const comIds = new Set<CompensationId>();
    const compensationAst = this.getCompensationAstFromAst(ast);
    comIds.add(CompensationId(compensationAst.name as string));
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

  private getPermittedAdIdsByPermittedQueryIds(
    parser: SDQLParser,
    permittedQueryIds: string[]
  ): AdId[] {
    const permittedAdIds = new Set<AdId>();

    const queryPermissions = parser.queryIdsToDataPermissions(permittedQueryIds);
    parser.adPermissions.forEach((adPermissions, adLogicExpr) => {
      if (queryPermissions.contains(adPermissions!)) {
        const adAstExpr = parser.logicAds.get(adLogicExpr);
        const adAst = this.getAdAstFromAst(adAstExpr!);

        permittedAdIds.add(AdId(adAst.key));
      }
    });

    return Array.from(permittedAdIds);
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

  public getPermittedQueryIdsFromSchemaString(
    schemaString: SDQLString,
    givenPermissions: DataPermissions,
  ): ResultAsync<
    string[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.parserFactory
      .makeParser(IpfsCID(""), schemaString)
      .andThen((parser) => {
        return parser.buildAST().andThen(() => {
          return this.getPermittedQueryIds(parser, givenPermissions);
        });
      });
  }

  public getPermittedQueryIds(
    parser: SDQLParser,
    givenPermissions: DataPermissions,
  ): ResultAsync<
    string[],
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
        resultIds.reduce<string[]>((acc, next) => {
          if (next != null) {
            acc.push(next);
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

  private adListContainsAllAdDependencies (
    permittedAdIds: string[],
    adDependencies: AST_Ad[]
  ): boolean {
    return adDependencies.every(ad => permittedAdIds.includes(ad.key));
  }

  private getDependenciesByCompensationId(
    parser: SDQLParser,
    compId : CompensationId
  ): (AST_Ad|AST_Query)[][] {

    const resultingArray: (AST_Ad|AST_Query)[][] = [];

    for (const [compExpr, comAst] of parser.logicCompensations) {
      const comIdFromExpression = this.extractCompensationIdFromAst(comAst!);
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
