import {
  AdKey,
  CompensationKey,
  DuplicateIdInSchema,
  ISDQLAd,
  ISDQLCompensations,
  ISDQLInsightBlock,
  InsightKey,
  MissingTokenConstructorError,
  ParserError,
  QueryExpiredError,
  QueryFormatError,
  SDQLString,
  IQueryDeliveryItems,
  IpfsCID,
  DataPermissions,
  HexString32,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

import {
  AST_Ad,
  AST_Compensation,
  AST_Evaluator,
  AST_Expr,
  AST_Insight,
  ,
  Command,
  Command_IF,
  SDQLParser,
} from "@query-parser/index.js";
import {
  ISDQLParserFactory,
  ISDQLParserFactoryType,
} from "@query-parser/interfaces/utilities/ISDQLParserFactory.js";
import {
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
} from "@query-parser/interfaces/utilities/ISDQLQueryWrapperFactory.js";
import { CachedQueryRepository } from "@query-parser/implementations/utilities/CachedQueryRepository.js";

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
    ads: AdKey[],
    insights: InsightKey[],
  ): ResultAsync<
    CompensationKey[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    throw new Error("");
  }

  protected extractCompensationKeyFromAst(
    ast: AST_Expr | Command,
  ): CompensationKey {
    const compensationAst = this.getCompensationAstFromAst(ast);
    return CompensationKey(compensationAst.name as string);
  }

  protected extractCompensationKeyFromAstWithAlternatives(
    ast: AST_Expr | Command,
  ): CompensationKey[] {
    const comIds = new Set<CompensationKey>();
    const compensationAst = this.getCompensationAstFromAst(ast);
    comIds.add(CompensationKey(compensationAst.name as string));
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
    expectedCompensationKeys: CompensationKey[],
  ): Map<CompensationKey, ISDQLCompensations> {
    const expectedCompensationBlocks: Map<CompensationKey, ISDQLCompensations> =
      new Map();

    const compensationSchema = parser.schema.getCompensationSchema();
    for (const compensationKey in compensationSchema) {
      if (
        !expectedCompensationKeys.includes(CompensationKey(compensationKey))
      ) {
        continue;
      }
      expectedCompensationBlocks[compensationKey] = // 'c1': ISDQLCompensations object
        compensationSchema[compensationKey] as ISDQLCompensations;
    }

    return expectedCompensationBlocks;
  }

  private hasRequiredInsights(
    permittedInsightKeys: InsightKey[],
    requiredInsights: AST_Insight[],
  ): boolean {
    return requiredInsights.every((required) => {
      return permittedInsightKeys.includes(InsightKey(required.name));
    });
  }

  private hasRequiredAds(
    permittedAdKeys: AdKey[],
    requiredAds: AST_Ad[],
  ): boolean {
    return requiredAds.every((required) => {
      return permittedAdKeys.includes(AdKey(required.name));
    });
  }

  // New methods. All of the above should be deprecated

  /**
   * This is the entry point for InsightPlatform to dispense compensations
   * @param schemaString
   * @param queryDeliveryItems
   */
  public getCompensationsToDispense(
    schemaString: SDQLString,
    queryDeliveryItems: IQueryDeliveryItems,
  ): ResultAsync<
    CompensationKey[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  > {
    return this.parserFactory
      .makeParser(IpfsCID(""), schemaString)
      .andThen((parser) => {
        return parser.buildAST().andThen((ast) => {
          return errAsync(new Error("Not implemented"));
          const queryRepository = this.createCachedQueryRepository(queryDeliveryItems);
          const astEvaluator = new AST_Evaluator(
            parser.cid,
            queryRepository,
            new DataPermissions(HexString32("0xFFFFFFFF"))
          )
          
        });
      });
  }

  private createCachedQueryRepository(queryDeliveryItems): CachedQueryRepository {

    if ("queries" in queryDeliveryItems === false) {
      return new CachedQueryRepository(new Map());
    } else {
      return new CachedQueryRepository(queryDeliveryItems["queries"]);
    }


  }
}
