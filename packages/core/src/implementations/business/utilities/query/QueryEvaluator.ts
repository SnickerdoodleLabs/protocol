import {
  Age,
  CountryCode,
  DiscordGuildProfile,
  EQueryEvents,
  ESocialType,
  EvalNotImplementedError,
  Gender,
  PersistenceError,
  PublicEvents,
  QueryPerformanceEvent,
  SDQL_Return,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import {
  AST_BalanceQuery,
  AST_BlockchainTransactionQuery,
  AST_NftQuery,
  AST_PropertyQuery,
  AST_SubQuery,
  BinaryCondition,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IBlockchainTransactionQueryEvaluator,
  IBlockchainTransactionQueryEvaluatorType,
  INftQueryEvaluator,
  INftQueryEvaluatorType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IBalanceQueryEvaluator,
  IBalanceQueryEvaluatorType,
  IQueryEvaluator,
} from "@core/interfaces/business/utilities/query/index.js";
import {
  IBrowsingDataRepository,
  IBrowsingDataRepositoryType,
  IDemographicDataRepository,
  IDemographicDataRepositoryType,
  ISocialRepository,
  ISocialRepositoryType,
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class QueryEvaluator implements IQueryEvaluator {
  constructor(
    @inject(IBalanceQueryEvaluatorType)
    protected balanceQueryEvaluator: IBalanceQueryEvaluator,
    @inject(IBlockchainTransactionQueryEvaluatorType)
    protected blockchainTransactionQueryEvaluator: IBlockchainTransactionQueryEvaluator,
    @inject(INftQueryEvaluatorType)
    protected nftQueryEvaluator: INftQueryEvaluator,
    @inject(IDemographicDataRepositoryType)
    protected demographicDataRepo: IDemographicDataRepository,
    @inject(IBrowsingDataRepositoryType)
    protected browsingDataRepo: IBrowsingDataRepository,
    @inject(ITransactionHistoryRepositoryType)
    protected transactionRepo: ITransactionHistoryRepository,
    @inject(ISocialRepositoryType)
    protected socialRepo: ISocialRepository,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}

  protected age: Age = Age(0);
  protected location: CountryCode = CountryCode("12345");

  public eval<T extends AST_SubQuery>(
    query: T,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return this.contextProvider.getContext().andThen((context) => {
      if (query instanceof AST_BlockchainTransactionQuery) {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.ChainTransactionEvaluation,
            "start",
          ),
        );
        return this.blockchainTransactionQueryEvaluator
          .eval(query, context.publicEvents)
          .map((result) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionEvaluation,
                "end",
              ),
            );
            return result;
          });
      } else if (query instanceof AST_BalanceQuery) {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.BalanceEvaluation, "start"),
        );
        return this.balanceQueryEvaluator
          .eval(query, context.publicEvents)
          .map((result) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(EQueryEvents.BalanceEvaluation, "end"),
            );
            return result;
          });
      } else if (query instanceof AST_NftQuery) {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.NftDataEvaluation, "start"),
        );
        return this.nftQueryEvaluator
          .eval(query, context.publicEvents)
          .map((result) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(EQueryEvents.NftDataEvaluation, "end"),
            );
            return result;
          });
      } else if (query instanceof AST_PropertyQuery) {
        return this.evalPropertyQuery(query, context.publicEvents);
      }
      return errAsync(
        new PersistenceError(
          `Unknown query type in QueryEvaluator.eval, ${query.name}`,
        ),
      );
    });
  }

  public evalPropertyQuery(
    q: AST_PropertyQuery,
    publicEvents: PublicEvents,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    let result = SDQL_Return(true);
    switch (q.property) {
      case "age":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.AgeEvaluation, "start"),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.AgeDataAccess, "start"),
        );
        return this.demographicDataRepo.getAge().andThen((age) => {
          publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(EQueryEvents.AgeDataAccess, "end"),
          );
          switch (q.returnType) {
            case "boolean":
              for (const condition of q.conditions) {
                result = result && this.evalPropertyConditon(age, condition);
              }
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.AgeEvaluation, "end"),
              );
              return okAsync(result);
            case "integer":
            case "number":
              result = SDQL_Return(age);
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.AgeEvaluation, "end"),
              );
              return okAsync(result);
            default:
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.AgeEvaluation, "end"),
              );
              return okAsync(result);
          }
        });
      case "location":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.LocationEvaluation, "start"),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.LocationDataAccess, "start"),
        );
        return this.demographicDataRepo.getLocation().andThen((location) => {
          publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(EQueryEvents.LocationDataAccess, "end"),
          );
          switch (q.returnType) {
            case "string":
              result = SDQL_Return(location);
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.LocationEvaluation, "end"),
              );
              return okAsync(result);
            case "boolean":
              for (const condition of q.conditions) {
                result =
                  result && this.evalPropertyConditon(location, condition);
              }
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.LocationEvaluation, "end"),
              );
              return okAsync(result);
            case "integer":
              result = SDQL_Return(location);
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.LocationEvaluation, "end"),
              );
              return okAsync(result);
            default:
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.LocationEvaluation, "end"),
              );
              return okAsync(result);
          }
        });
      case "gender":
      publicEvents.queryPerformance.next(
        new QueryPerformanceEvent(EQueryEvents.GenderEvaluation, "start"),
      );
      publicEvents.queryPerformance.next(
        new QueryPerformanceEvent(EQueryEvents.GenderDataAccess, "start"),
      );
        return this.demographicDataRepo.getGender().andThen((gender) => {
          publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(EQueryEvents.GenderDataAccess, "end"),
          );
          switch (q.returnType) {
            case "enum":
              if (q.enum_keys) {
                for (const key of q.enum_keys) {
                  if (key == gender) {
                    publicEvents.queryPerformance.next(
                      new QueryPerformanceEvent(EQueryEvents.GenderEvaluation, "end"),
                    );
                    return okAsync(SDQL_Return(gender));
                  }
                }
              }
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.GenderEvaluation, "end"),
              );
              return okAsync(SDQL_Return(Gender("unknown")));
            default:
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(EQueryEvents.GenderEvaluation, "end"),
              );
              return okAsync(result);
          }
        });
      case "url_visited_count":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.BrowserActivityEvaluation, "start"),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.BrowserActivityDataAccess, "start"),
        );
        return this.browsingDataRepo
          .getSiteVisitsMap(q.timestampRange!)
          .andThen((url_visited_count) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(EQueryEvents.BrowserActivityDataAccess, "end"),
            );      publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(EQueryEvents.BrowserActivityEvaluation, "end"),
            );
            return okAsync(SDQL_Return(url_visited_count));
          });
      case "chain_transactions":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.ChainTransactionEvaluation, "start"),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.ChainTransactionDataAccess, "start"),
        );
        return this.transactionRepo
          .getTransactionByChain()
          .andThen((transactionArray) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(EQueryEvents.ChainTransactionDataAccess, "end"),
            );
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(EQueryEvents.ChainTransactionEvaluation, "end"),
            );
            return okAsync(SDQL_Return(transactionArray));
          });
      case "social_discord":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.DiscordEvaluation, "start"),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(EQueryEvents.DiscordDataAccess, "start"),
        );
        return this.getDiscordProfiles().map((res) => {
          publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(EQueryEvents.DiscordDataAccess, "end"),
          );
          publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(EQueryEvents.DiscordEvaluation, "end"),
          );
          return res;
        });
      case "social_twitter":
        return this.getTwitterFollowers();
      default:
        return okAsync(result);
    }
  }

  public evalPropertyConditon(
    propertyVal: Age | CountryCode | null,
    condition: BinaryCondition,
  ): SDQL_Return {
    if (propertyVal == null) {
      // const err = new Error("In evalPropertyConditon, propertyVal is null!");
      // console.error(err);
      // throw err;
      return SDQL_Return(null);
    }
    //console.log(`Evaluating property condition ${condition} against ${propertyVal}`);
    // let val: number | AST_Expr = 0;
    const rVal = condition.rval;
    if (rVal == null) {
      return SDQL_Return(null);
    }
    if (condition instanceof ConditionGE) {
      return SDQL_Return(propertyVal >= rVal);
    } else if (condition instanceof ConditionG) {
      return SDQL_Return(propertyVal > rVal);
    } else if (condition instanceof ConditionL) {
      return SDQL_Return(propertyVal < rVal);
    } else if (condition instanceof ConditionE) {
      return SDQL_Return(propertyVal == rVal);
    } else if (condition instanceof ConditionLE) {
      return SDQL_Return(propertyVal <= rVal);
    } else if (condition instanceof ConditionIn) {
      const find_val = condition.lval;
      const in_values = rVal as Array<string | number>;
      for (let i = 0; i < in_values.length; i++) {
        if (find_val == in_values[i]) {
          return SDQL_Return(true);
        }
      }
      return SDQL_Return(false);
    }

    console.error(`EvalNotImplementedError ${condition.constructor.name}`);
    throw new EvalNotImplementedError(
      `${condition.constructor.name} not implemented`,
    );
  }

  getDiscordProfiles(): ResultAsync<SDQL_Return, PersistenceError> {
    return this.socialRepo
      .getGroupProfiles<DiscordGuildProfile>(ESocialType.DISCORD)
      .map((profiles) => {
        return SDQL_Return(
          profiles.map((profile) => {
            return {
              id: profile.id,
              name: profile.name,
              icon: profile.icon,
              joinedAt: profile.joinedAt,
            };
          }),
        );
      });
  }

  getTwitterFollowers(): ResultAsync<SDQL_Return, PersistenceError> {
    return this.socialRepo
      .getProfiles<TwitterProfile>(ESocialType.TWITTER)
      .map((profiles) => {
        return SDQL_Return(
          profiles.map((profile) => {
            return {
              following: profile.followData?.following || [],
            };
          }),
        );
      });
  }
}
