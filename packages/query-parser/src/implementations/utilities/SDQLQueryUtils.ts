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
        this.getCompensationIdsByPermittedQueryIds(parser, queryIds)
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
            this.getCompensationIdsByPermittedQueryIds(parser, permittedQueryIds)

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

  private getCompensationIdsByPermittedQueryIds(
    parser: SDQLParser,
    permittedQueryIds: string[]
  ): CompensationId[] {

    const queryPermissions = parser.queryIdsToDataPermissions(permittedQueryIds);
    const eligibleAdIds = this.getEligibleAdIdsByQueryPermissions(parser, queryPermissions);

    const eligibleComIds = new Set<CompensationId>();
    parser.compensationPermissions.forEach((comPermissions, compExpr) => {

      if (queryPermissions.contains(comPermissions!)) {
        const adDependencies = parser.parseAdDependencies(compExpr);
        if (adDependencies.every((dep) => eligibleAdIds.has(AdId(dep.key)))) {

          const comAst = parser.logicCompensations.get(compExpr);
          const comIds = this.extractCompensationIdFromAstWithAlternatives(comAst!);

          comIds.forEach((comId) => eligibleComIds.add(comId));
        }
      }
    });

    return Array.from(eligibleComIds);
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

  private getEligibleAdIdsByQueryPermissions(
    parser: SDQLParser,
    queryPermissions: DataPermissions
  ): Set<AdId> {
    const eligibleAdIds = new Set<AdId>();

    parser.adPermissions.forEach((adPermissions, adLogicExpr) => {
      if (queryPermissions.contains(adPermissions!)) {
        const adAstExpr = parser.logicAds.get(adLogicExpr);
        const adAst = this.getAdAstFromAst(adAstExpr!);

        eligibleAdIds.add(AdId(adAst.key));
      }
    });

    return eligibleAdIds;
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
}
