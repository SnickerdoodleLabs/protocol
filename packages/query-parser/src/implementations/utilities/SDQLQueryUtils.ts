import {
  CompensationIdentifier,
  DataPermissions,
  DuplicateIdInSchema,
  IpfsCID,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFormatError,
  QueryIdentifier,
  SDQLString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { SDQLParser } from "@query-parser/implementations/business/SDQLParser";
import {
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
    CompensationIdentifier[],
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

  public getCompensationIdsByPermittedQueryIds(
    parser: SDQLParser,
    permittedQueryIds: QueryIdentifier[]
  ): CompensationIdentifier[] {

    const queryPermissions = parser.queryIdsToDataPermissions(permittedQueryIds);
    // console.log("queryPermissions", queryPermissions.getFlags());
    // now queryPermissions must contain the permission for each compensation expr for eligibility
    const eligibleComIds = new Set<CompensationIdentifier>();
    // console.log("logicPermissions", parser.returnPermissions);
    // console.log("compensationPermissions", parser.compensationPermissions);

    parser.compensationPermissions.forEach((comPermissions, compExpr) => {
      if (queryPermissions.contains(comPermissions!)) {
        const comAst = parser.logicCompensations.get(compExpr);
        const comIds = this.extractCompensationIdFromAstWithAlternatives(comAst!);

        comIds.forEach((comId) => eligibleComIds.add(comId));
      }
    });

    return Array.from(eligibleComIds);
  }

  protected extractCompensationIdFromAst(
    ast: AST_Expr | Command,
  ): CompensationIdentifier {
    // console.log("extractCompensationIdFromAst: ast", ast);
    const compensationAst = this.getCompensationAstFromAst(ast);
    return CompensationId(compensationAst.name as string);
  }

  protected extractCompensationIdFromAstWithAlternatives(
    ast: AST_Expr | Command,
  ): Set<CompensationIdentifier> {
    // console.log("extractCompensationIdFromAst: ast", ast);
    const comIds = new Set<CompensationIdentifier>();
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
            acc.push( QueryIdentifier(next) );
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
