import {
  AdKey,
  CompensationKey,
  DuplicateIdInSchema,
  ISDQLAd,
  ISDQLCompensations,
  ISDQLInsightBlock,
  InsightKey,
  MissingTokenConstructorError,
  MissingWalletDataTypeError,
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
  MissingASTError,
  PersistenceError,
  EvalNotImplementedError,
  EvaluationError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { RequiresEvaluator } from "@query-parser/implementations/business/evaluators/RequiresEvaluator.js";
import { SDQLParser } from "@query-parser/implementations/index.js";
import {
  AST_Ad,
  AST_SubQuery,
  AST_Compensation,
  AST_Expr,
  AST_Insight,
  AST_PropertyQuery,
  AST_Web3Query,
  Command,
  Command_IF,
  ISDQLQueryUtils,
  AST,
} from "@query-parser/interfaces/index.js";
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
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
    | EvaluationError
  > {
    return this.parserFactory
      .makeParser(IpfsCID(""), schemaString)
      .andThen((parser) => {
        return parser.buildAST().andThen((ast) => {
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

  /**
   *
   * @param activeCompensationKeys the rewards which are not expired yet.
   * @param possibleInsightsAndAds the possible set of insights and ads the api caller can generate
   * @returns
   */
  public filterCompensationsForPreviews(
    queryCID: IpfsCID,
    schemaString: SDQLString,
    activeCompensationKeys: CompensationKey[],
    possibleInsightsAndAds: (InsightKey | AdKey)[],
  ): ResultAsync<
    PossibleReward[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
  > {
    return this.parserFactory
      .makeParser(queryCID, schemaString)
      .andThen((parser) => {
        return parser.buildAST().andThen((ast) => {
          const compensationQueryDependeciesAsync = activeCompensationKeys.map(
            (compensationKey) => {
              return parser.getQueryDependencies(
                ast.compensations.get(SDQL_Name(compensationKey))!.requires,
                possibleInsightsAndAds,
              );
            },
          );
          return ResultUtils.combine(compensationQueryDependeciesAsync).map(
            (compensationQueryDependecies) => {
              return this.getPossibleRewards(
                compensationQueryDependecies,
                parser.cid,
                ast,
                activeCompensationKeys,
              );
            },
          );
        });
      });
  }

  getPossibleRewards(
    compensationQueryDependecies: Set<AST_SubQuery>[],
    cid: IpfsCID,
    ast: AST,
    activeCompensationKeys: CompensationKey[],
  ): PossibleReward[] {
    return compensationQueryDependecies.reduce<PossibleReward[]>(
      (possibleRewards, compensationQueryDependency, currentIndex) => {
        const compensation = ast.compensations.get(
          SDQL_Name(activeCompensationKeys[currentIndex]),
        );
        if (compensation) {
          possibleRewards.push(
            new PossibleReward(
              cid,
              CompensationKey(activeCompensationKeys[currentIndex]),
              this.getSubQueryDependicies(compensationQueryDependency),
              compensation.rewardName,
              compensation.image,
              compensation.description,
              compensation.chainId,
              ERewardType.Direct,
            ),
          );
        }

        return possibleRewards;
      },
      [],
    );
  }
  getSubQueryDependicies(astSubQueries: Set<AST_SubQuery>): QueryTypes[] {
    const queryTypes: QueryTypes[] = [];
    astSubQueries.forEach((subQuery) => {
      const type = this.getQueryType(subQuery);
      if (type) {
        queryTypes.push(type);
      }
    });
    return queryTypes;
  }
  getQueryType(query: AST_SubQuery): QueryTypes | null {
    if (query instanceof AST_Web3Query) {
      return query.type;
    } else if (query instanceof AST_PropertyQuery) {
      return query.property;
    }
    return null;
  }
}
