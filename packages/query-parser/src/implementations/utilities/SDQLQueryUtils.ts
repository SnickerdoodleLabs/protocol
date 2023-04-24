import {
  AdKey,
  CompensationId,
  DataPermissions,
  DuplicateIdInSchema,
  InsightKey,
  IpfsCID,
  ISDQLAd,
  ISDQLCompensations,
  ISDQLInsightBlock,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFilteredByPermissions,
  QueryFormatError,
  QueryIdentifier,
  QueryTypes,
  SDQLString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { SDQLParser } from "@query-parser/implementations/business/SDQLParser";
import {
  AST_Ad,
  AST_Compensation,
  AST_Expr,
  AST_PropertyQuery,
  AST_Query,
  AST_Web3Query,
  Command,
  Command_IF,
  ISDQLParserFactory,
  ISDQLParserFactoryType,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
} from "@query-parser/interfaces/index.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight";

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
    return this.parserFactory
      .makeParser(IpfsCID(""), schemaString)
      .andThen((parser) => {
        return parser.buildAST().map(() => {
          return parser;
        });
      })
      .andThen((parser) => {
        return this.getAllExpectedCompensationsIds(
          parser,
          this.getPermittedInsightKeysByPermittedQueryIds(parser, queryIds),
          this.getPermittedAdKeysByPermittedQueryIds(parser, queryIds),
        );
      });
  }

  public filterQueryByPermissions(
    schemaString: SDQLString,
    dataPermissions: DataPermissions,
  ): ResultAsync<QueryFilteredByPermissions, ParserError> {
    return this.parserFactory
      .makeParser(IpfsCID(""), schemaString)
      .andThen((parser) => {
        return parser.buildAST().map(() => parser);
      })
      .andThen((parser) => {
        return this.getPermittedQueryIds(parser, dataPermissions).andThen(
          (permittedQueryIds) => {
            const permittedAdKeys = this.getPermittedAdKeysByPermittedQueryIds(
              parser,
              permittedQueryIds,
            );
            const permittedInsightKeys =
              this.getPermittedInsightKeysByPermittedQueryIds(
                parser,
                permittedQueryIds,
              );
            return this.getAllExpectedCompensationsIds(
              parser,
              permittedInsightKeys,
              permittedAdKeys,
            ).map(
              (compKeys) =>
                new QueryFilteredByPermissions(
                  permittedQueryIds,
                  this.buildExpectedCompensationsMap(parser, compKeys),
                  this.buildEligibleAdsMap(parser, permittedAdKeys),
                  this.buildEligibleInsightsMap(parser, permittedInsightKeys),
                ),
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

  /**
   * @deprecated
   * compensations no more depend on queries. They depend on insights
   */
  public getQueryTypeDependencies(
    parser: SDQLParser,
    compId: CompensationId,
  ): ResultAsync<QueryTypes[], ParserError> {
    const comAst = parser.compensations.get(SDQL_Name(compId));
    if (!comAst) {
      return okAsync([]);
    }
    return parser
      .parseAdDependencies(comAst.requiresRaw)
      .andThen((adDependencies) => {
        if (adDependencies.length > 0) {
          return okAsync([]);
        }
        return parser.parseQueryDependencies(comAst.requiresRaw);
      })
      .map((queryDeps) => {
        return [
          ...queryDeps.reduce((acc, subQ) => {
            if (subQ instanceof AST_Web3Query) {
              acc.add(subQ.type);
            } else if (subQ instanceof AST_PropertyQuery) {
              acc.add(subQ.property);
            }
            return acc;
          }, new Set<QueryTypes>()),
        ];
      });
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
  ): CompensationId[] {
    // console.log("extractCompensationIdFromAst: ast", ast);
    const comIds = new Set<CompensationId>();
    const compensationAst = this.getCompensationAstFromAst(ast);
    comIds.add(CompensationId(compensationAst.name as string));
    for (const altId of compensationAst.alternatives) {
      comIds.add(altId);
    }

    return [...comIds];
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

  protected getAdAstFromAst(ast: AST_Expr | Command): AST_Ad {
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
        throw new QueryFormatError("Unknown expression to extract ad from.");
    }
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

  private getPermittedAdKeysByPermittedQueryIds(
    parser: SDQLParser,
    permittedQueryIds: string[],
  ): AdKey[] {
    const permittedAdKeys = new Set<AdKey>();

    const queryPermissions =
      parser.queryIdsToDataPermissions(permittedQueryIds);

    parser.ads.forEach((adAst, adName) => {
      if (queryPermissions.contains(adAst.requiredPermissions)) {
        permittedAdKeys.add(AdKey(adName));
      }
    });
    return Array.from(permittedAdKeys);
  }

  private getPermittedInsightKeysByPermittedQueryIds(
    parser: SDQLParser,
    permittedQueryIds: string[],
  ): InsightKey[] {
    const permittedInsightKeys = new Set<InsightKey>();

    const queryPermissions =
      parser.queryIdsToDataPermissions(permittedQueryIds);

    parser.insights.forEach((insightAst, insightName) => {
      if (queryPermissions.contains(insightAst.requiredPermissions)) {
        permittedInsightKeys.add(InsightKey(insightName));
      }
    });

    return Array.from(permittedInsightKeys);
  }

  private buildEligibleAdsMap(
    parser: SDQLParser,
    permittedAdKeys: AdKey[],
  ): Map<AdKey, ISDQLAd> {
    const eligibleAdBlocks: Map<AdKey, ISDQLAd> = new Map();

    const adSchema = parser.schema.getAdsSchema();
    for (const adKey in adSchema) {
      if (!permittedAdKeys.includes(AdKey(adKey))) {
        continue;
      }
      eligibleAdBlocks[adKey] = adSchema[adKey] as ISDQLAd;
    }

    return eligibleAdBlocks;
  }

  private buildEligibleInsightsMap(
    parser: SDQLParser,
    permittedInsightKeys: InsightKey[],
  ): Map<InsightKey, ISDQLInsightBlock> {
    const eligibleInsightBlocks: Map<InsightKey, ISDQLInsightBlock> = new Map();

    const insightSchema = parser.schema.getInsightSchema();
    for (const insightKey in insightSchema) {
      if (!permittedInsightKeys.includes(InsightKey(insightKey))) {
        continue;
      }
      eligibleInsightBlocks[insightKey] = insightSchema[
        insightKey
      ] as ISDQLInsightBlock;
    }

    return eligibleInsightBlocks;
  }

  private buildExpectedCompensationsMap(
    parser: SDQLParser,
    expectedCompensationIds: CompensationId[],
  ): Map<CompensationId, ISDQLCompensations> {
    const expectedCompensationBlocks: Map<CompensationId, ISDQLCompensations> =
      new Map();

    const compensationSchema = parser.schema.getCompensationSchema();
    for (const compensationKey in compensationSchema) {
      if (!expectedCompensationIds.includes(CompensationId(compensationKey))) {
        continue;
      }
      expectedCompensationBlocks[compensationKey] = // 'c1': ISDQLCompensations object
        compensationSchema[compensationKey] as ISDQLCompensations;
    }

    return expectedCompensationBlocks;
  }

  private getAllExpectedCompensationsIds(
    parser: SDQLParser,
    permittedInsightKeys: InsightKey[],
    permittedAdKeys: AdKey[],
  ): ResultAsync<CompensationId[], ParserError> {
    return ResultUtils.combine(
      (
        Object.entries(parser.compensations) as [SDQL_Name, AST_Compensation][]
      ).map(([compKey, comAst]) => {

        return ResultUtils.combine([
          parser.parseInsightDependencies(comAst.requiresRaw),
          parser.parseAdDependencies(comAst.requiresRaw),
        ]).map(([insightDeps, adDeps]) => {

          if (
            this.hasRequiredInsights(permittedInsightKeys, insightDeps) &&
            this.hasRequiredAds(permittedAdKeys, adDeps)
          ) {
            return CompensationId(compKey);
          }
          return undefined;
        });
      }),
    ).map(
      (expectedComps) =>
        expectedComps.filter((comp) => !!comp) as CompensationId[],
    );
  }

  private hasRequiredInsights(
    permittedInsightKeys: InsightKey[],
    requiredInsights: AST_Insight[],
  ): boolean {
    return requiredInsights.every((required) => {
      permittedInsightKeys.includes(InsightKey(required.name));
    });
  }

  private hasRequiredAds(
    permittedAdKeys: AdKey[],
    requiredAds: AST_Ad[],
  ): boolean {
    return requiredAds.every((required) => {
      permittedAdKeys.includes(AdKey(required.name));
    });
  }

  // private getExpectedCompensationIdsByQueryIds(
  //   parser: SDQLParser,
  //   queryIds: string[],
  // ): CompensationId[] {
  //   const queryPermissions = parser.queryIdsToDataPermissions(queryIds);

  //   const queryCompensationIds = new Set<CompensationId>();
  //   parser.compensationPermissions.forEach((comPermissions, compExpr) => {
  //     const adDependencies = parser.parseAdDependencies(compExpr);
  //     if (
  //       adDependencies.length == 0 && // Is a query compensation
  //       queryPermissions.contains(comPermissions!)
  //     ) {
  //       const comAst = parser.logicCompensations.get(compExpr);
  //       const comIds = this.extractCompensationIdFromAstWithAlternatives(
  //         comAst!,
  //       );

  //       comIds.forEach((comId) => queryCompensationIds.add(comId));
  //     }
  //   });

  //   return Array.from(queryCompensationIds);
  // }

  // private getExpectedCompensationIdsByQueryIds(
  //   parser: SDQLParser,
  //   queryIds: string[],
  // ): CompensationId[] {
  //   const queryPermissions = parser.queryIdsToDataPermissions(queryIds);

  //   const queryCompensationIds = new Set<CompensationId>();
  //   parser.compensationPermissions.forEach((comPermissions, compExpr) => {
  //     const adDependencies = parser.parseAdDependencies(compExpr);
  //     if (
  //       adDependencies.length == 0 && // Is a query compensation
  //       queryPermissions.contains(comPermissions!)
  //     ) {
  //       const comAst = parser.logicCompensations.get(compExpr);
  //       const comIds = this.extractCompensationIdFromAstWithAlternatives(
  //         comAst!,
  //       );

  //       comIds.forEach((comId) => queryCompensationIds.add(comId));
  //     }
  //   });

  //   return Array.from(queryCompensationIds);
  // }

  private adListContainsAllAdDependencies(
    permittedAdKeys: string[],
    adDependencies: AST_Ad[],
  ): boolean {
    return adDependencies.every((ad) => permittedAdKeys.includes(ad.key));
  }
}
