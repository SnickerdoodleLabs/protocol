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
  SDQL_Name,
  IInsightWithProof,
  InsightString,
  ProofError,
  PossibleReward,
  ERewardType,
  QueryTypes,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { RequiresEvaluator } from "@query-parser/implementations/business/evaluators/RequiresEvaluator.js";
import {
  AST_Ad,
  AST_Compensation,
  AST_Expr,
  AST_Insight,
  AST_PropertyQuery,
  AST_SubQuery,
  AST_Web3Query,
  Command,
  Command_IF,
  ISDQLQueryUtils,
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


@injectable()
export class SDQLQueryUtils implements ISDQLQueryUtils {
  public constructor(
    @inject(ISDQLParserFactoryType)
    protected parserFactory: ISDQLParserFactory,
    @inject(ISDQLQueryWrapperFactoryType)
    readonly queryWrapperFactory: ISDQLQueryWrapperFactory,
  ) {}

  /**
   * @deprecated The method should not be used
   */
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

  /**
   * @deprecated The method should not be used
   */
  protected extractCompensationKeyFromAst(
    ast: AST_Expr | Command,
  ): CompensationKey {
    const compensationAst = this.getCompensationAstFromAst(ast);
    return CompensationKey(compensationAst.name as string);
  }

  /**
   * @deprecated The method should not be used
   */
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

  /**
   * @deprecated The method should not be used
   */
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

  /**
   * @deprecated The method should not be used
   */
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

  /**
   * @deprecated The method should not be used
   */
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

  /**
   * @deprecated The method should not be used
   */
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

  /**
   * @deprecated The method should not be used
   */
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

  /**
   * @deprecated The method should not be used
   */
  private hasRequiredInsights(
    permittedInsightKeys: InsightKey[],
    requiredInsights: AST_Insight[],
  ): boolean {
    return requiredInsights.every((required) => {
      return permittedInsightKeys.includes(InsightKey(required.name));
    });
  }

  /**
   * @deprecated The method should not be used
   */
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
          // return errAsync(new Error("Not implemented"));
          const availableMap =
            this.createAvailableMapForRequiresEvaluator(queryDeliveryItems);
          const requiresEvaluator = new RequiresEvaluator(availableMap);

          const allKeys = [...ast.compensations.keys()];

          const results = allKeys.map((key) => {
            const compAst = ast.compensations.get(SDQL_Name(key));
            return requiresEvaluator.eval(compAst!.requires);
          });

          return ResultUtils.combine(results).map((compVals) => {
            return compVals.reduce<CompensationKey[]>(
              (dispensableKeys, compVal, idx) => {
                if (compVal == true) {
                  dispensableKeys.push(CompensationKey(allKeys[idx]));
                }
                return dispensableKeys;
              },
              [],
            );
          });
        });
      });
  }

  private createAvailableMapForRequiresEvaluator(
    queryDeliveryItems: IQueryDeliveryItems,
  ): Map<SDQL_Name, unknown> {
    const availableMap = new Map<SDQL_Name, unknown>();
    if (queryDeliveryItems.insights != null) {
      const keys = Object.keys(queryDeliveryItems.insights);
      keys.forEach((key) =>
        availableMap.set(SDQL_Name(key), queryDeliveryItems.insights![key]),
      );
    }
    if (queryDeliveryItems.ads != null) {
      const keys = Object.keys(queryDeliveryItems.ads);
      keys.forEach((key) =>
        availableMap.set(SDQL_Name(key), queryDeliveryItems.ads![key]),
      );
    }

    return availableMap;
  }

  public getValidInsights(
    queryDeliveryItems: IQueryDeliveryItems,
  ): ResultAsync<Map<InsightKey, InsightString>, ProofError> {
    if (queryDeliveryItems.insights != null) {
      const keys = Object.keys(queryDeliveryItems.insights);
      const nonNullInsights = keys.reduce<Map<InsightKey, IInsightWithProof>>(
        (validMap, key) => {
          const value = queryDeliveryItems.insights![key];
          if (value != null) {
            validMap.set(InsightKey(key), value);
          }
          return validMap;
        },
        new Map<InsightKey, IInsightWithProof>(),
      );

      const nonNullKeys = Object.keys(nonNullInsights);
      const proofResults = nonNullKeys.map((key) =>
        this.validateProof(nonNullInsights[key]),
      );

      return ResultUtils.combine(proofResults).andThen((proofs) => {
        const provedInsights = proofs.reduce<Map<InsightKey, InsightString>>(
          (validMap, proof, idx) => {
            if (proof) {
              const validKey = InsightKey(nonNullKeys[idx]);
              validMap.set(validKey, nonNullInsights[validKey].insight);
            }

            return validMap;
          },
          new Map<InsightKey, InsightString>(),
        );

        return okAsync(provedInsights);
      });
    }

    return okAsync(new Map<InsightKey, InsightString>());
  }

  public getValidAds(
    queryDeliveryItems: IQueryDeliveryItems,
  ): ResultAsync<Map<AdKey, unknown>, ProofError> {
    const validAds = new Map<AdKey, unknown>();
    if (queryDeliveryItems.ads != null) {
      const keys = Object.keys(queryDeliveryItems.ads);
      keys.reduce<Map<AdKey, unknown>>((validMap, key) => {
        const value = queryDeliveryItems.ads![key];
        if (value != null) {
          validMap.set(AdKey(key), value);
        }
        return validMap;
      }, validAds);
    }

    return okAsync(validAds);
  }

  public validateProof(
    insightWithProof: IInsightWithProof,
  ): ResultAsync<boolean, ProofError> {
    // return errAsync(new Error("Not implemented"));
    return okAsync(true);
  }

  public getPossibleRewardsFromIP(
    schemaString: SDQLString,
    queryCID: IpfsCID,
    answeredInsightsAndAdKeys: (InsightKey | AdKey)[],
  ): ResultAsync<PossibleReward[], ParserError> {
    return this.parserFactory
      .makeParser(queryCID, schemaString)
      .andThen((parser) => {
        return parser.buildAST().map((ast) => {
          const compensationsMap = ast.compensations;

          const possibleRewards: PossibleReward[] = [];

          compensationsMap.forEach((compensation, compensationKey) => {
            const { requirementsAreSatisfied, requiredInsightsAndAds } =
              this.evaluateAstRawCompensationRequires(
                compensation.requiresRaw,
                answeredInsightsAndAdKeys,
              );
            if (requirementsAreSatisfied) {
              const queryDependecies: QueryTypes[] = this.getQueryDependicies(
                requiredInsightsAndAds,
                ast.subqueries,
                ast.insights,
                ast.ads,
              );
              const possibleReward = new PossibleReward(
                parser.cid,
                CompensationKey(compensationKey),
                queryDependecies,
                compensation.name,
                compensation.image,
                compensation.description,
                compensation.chainId,
                ERewardType.Direct,
              );
              possibleRewards.push(possibleReward);
            }
          });

          return possibleRewards;
        });
      });
  }

  removeDollarSign(values: string[]) {
    return values.map((value) => value.replace("$", ""));
  }
  getQueryDependicies(
    insightAndAdKeys: string[],
    astQueries: Map<SDQL_Name, AST_SubQuery>,
    astInsights: Map<SDQL_Name, AST_Insight>,
    astAds: Map<SDQL_Name, AST_Ad>,
  ): QueryTypes[] {
    const queryTypes: QueryTypes[] = [];

    const dollerizedKeys = this.getQueryKeys(
      this.removeDollarSign(insightAndAdKeys),
      astInsights,
      astAds,
    );
    const queryKeys = new Set(this.removeDollarSign(dollerizedKeys));

    queryKeys.forEach((queryKey) => {
      const type = this.getQueryType(astQueries.get(SDQL_Name(queryKey))!);
      if (type) {
        queryTypes.push(type);
      }
    });
    return queryTypes;
  }

  getQueryType(query: AST_SubQuery): QueryTypes | null {
    console.log("qu", query);
    if (query instanceof AST_Web3Query) {
      return query.type;
    } else if (query instanceof AST_PropertyQuery) {
      return query.property;
    }
    return null;
  }

  getQueryKeysFromTargetRaw(targetRaw: string) {
    const queryKeys = targetRaw.match(/\$q\d+/g);
    if (queryKeys) {
      return queryKeys;
    }
    return [];
  }
  getQueryKeys(
    insightAndAdKeys: string[],
    astInsights: Map<SDQL_Name, AST_Insight>,
    astAds: Map<SDQL_Name, AST_Ad>,
  ): string[] {
    let queryKeys: string[] = [];
    insightAndAdKeys.forEach((key) => {
      if (key.startsWith("i")) {
        queryKeys = [
          ...queryKeys,
          ...this.getQueryKeysFromTargetRaw(
            astInsights.get(SDQL_Name(key))!.targetRaw,
          ),
        ];
      } else {
        queryKeys = [
          ...queryKeys,
          ...this.getQueryKeysFromTargetRaw(
            astAds.get(SDQL_Name(key))!.targetRaw,
          ),
        ];
      }
    });
    return queryKeys;
  }

  evaluateAstRawCompensationRequires(
    compensationRequiresRaw: string,
    totalInsightsAndAdsAnswered: string[],
  ): { requirementsAreSatisfied: boolean; requiredInsightsAndAds: string[] } {
    const totalInsightAndAdsAnsweredSet: Set<string> = new Set(
      totalInsightsAndAdsAnswered,
    );
    const requiredInsightsAndAds: string[] = [];

    const requirementsAreSatisfied = this.evaluateSubAstRawCompensationRequires(
      compensationRequiresRaw,
      totalInsightAndAdsAnsweredSet,
      requiredInsightsAndAds,
    );
    return { requirementsAreSatisfied, requiredInsightsAndAds };
  }

  splitCompensationRequirementsToProcessableExpressions(
    subRequirementExpression: string,
  ): RegExpMatchArray {
    const subExprRegex = /(\$[ia]\d+)|\(|\)|and|or/g;
    const parts = subRequirementExpression.match(subExprRegex);
    if (parts) {
      return parts;
    }
    throw new QueryFormatError("Invalid requires string: Unknown expression.");
  }

  evaluateSubAstRawCompensationRequires(
    subRequirementExpression: string,
    totalInsightAndAdsAnsweredSet: Set<string>,
    requiredInsightsAndAds: string[],
  ): boolean {
    const expressions =
      this.splitCompensationRequirementsToProcessableExpressions(
        subRequirementExpression,
      );
    const stack: boolean[] = [];
    let currentOperator: "and" | "or" | undefined;

    for (const expression of expressions) {
      if (expression === "(") {
        stack.push(true); 
      } else if (expression === ")") {
        if (stack.length > 0) {
          stack.pop();
          if (stack.length === 0) {
            const subExprResult = this.evaluateSubAstRawCompensationRequires(
              currentOperator!,
              totalInsightAndAdsAnsweredSet,
              requiredInsightsAndAds,
            );
            stack.push(subExprResult);
            currentOperator = undefined;
          }
        } else {
          throw new QueryFormatError(
            "Invalid requires string: Unbalanced parentheses.",
          );
        }
      } else if (expression === "and" || expression === "or") {
        currentOperator = expression;
      } else {
        if (totalInsightAndAdsAnsweredSet.has(expression)) {
          requiredInsightsAndAds.push(expression);
        }
        stack.push(totalInsightAndAdsAnsweredSet.has(expression));
        if (stack.length > 1 && currentOperator) {
          const operand2 = stack.pop();
          const operand1 = stack.pop();
          if (operand1 === undefined || operand2 === undefined) {
            throw new QueryFormatError(
              "Invalid requires string: Unknown expression.",
            );
          }
          if (currentOperator === "and") {
            stack.push(operand1 && operand2);
          } else if (currentOperator === "or") {
            stack.push(operand1 || operand2);
          }
          currentOperator = undefined;
        }
      }
    }
    if (stack.length !== 1) {
      throw new QueryFormatError(
        "Invalid requires string: Malformed expression.",
      );
    }

    return stack[0];
  }
}
