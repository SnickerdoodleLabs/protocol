import {
  AccountIndexingError,
  Age,
  AjaxError,
  CountryCode,
  DiscordGuildProfile,
  EQueryEvents,
  ESocialType,
  EStatus,
  EvalNotImplementedError,
  Gender,
  InvalidParametersError,
  IpfsCID,
  MethodSupportError,
  PersistenceError,
  PublicEvents,
  QueryPerformanceEvent,
  SDQL_Return,
  TwitterProfile,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  AST_BalanceQuery,
  AST_BlockchainTransactionQuery,
  AST_NftQuery,
  AST_PropertyQuery,
  AST_QuestionnaireQuery,
  AST_SubQuery,
  AST_Web3AccountQuery,
  BinaryCondition,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionLE,
  TypeChecker,
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
  IWeb3AccountQueryEvaluator,
  IWeb3AccountQueryEvaluatorType,
} from "@core/interfaces/business/utilities/query/index.js";
import {
  IBrowsingDataRepository,
  IBrowsingDataRepositoryType,
  IDemographicDataRepository,
  IDemographicDataRepositoryType,
  IQuestionnaireRepository,
  IQuestionnaireRepositoryType,
  ISocialRepository,
  ISocialRepositoryType,
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";
import { IQuestionnaireService, IQuestionnaireServiceType } from "@core/interfaces/business";

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
    @inject(IWeb3AccountQueryEvaluatorType)
    protected web3AccountQueryEvaluator: IWeb3AccountQueryEvaluator,
    // @inject(IQuestionnaireQueryEvaluatorType)
    // protected questionaireQueryEvaluator: IQuestionaireQueryEvaluator,
    @inject (IQuestionnaireRepositoryType) 
    protected questionnaireRepo: IQuestionnaireRepository,
  ) {}

  protected age: Age = Age(0);
  protected location: CountryCode = CountryCode("12345");

  public eval<T extends AST_SubQuery>(
    query: T,
    queryCID: IpfsCID,
    queryTimestamp: UnixTimestamp,
  ): ResultAsync<
    SDQL_Return,
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      if (query instanceof AST_BlockchainTransactionQuery) {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.ChainTransactionEvaluation,
            EStatus.Start,
            queryCID,
            query.name,
          ),
        );
        return this.blockchainTransactionQueryEvaluator
          .eval(query, queryCID, queryTimestamp)
          .map((result) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ChainTransactionEvaluation,
                EStatus.End,
                queryCID,
                query.name,
              ),
            );
            return result;
          })
          .mapErr((err) => {
            new QueryPerformanceEvent(
              EQueryEvents.ChainTransactionEvaluation,
              EStatus.End,
              queryCID,
              query.name,
              err,
            );
            return err;
          });
      } else if (query instanceof AST_BalanceQuery) {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.BalanceEvaluation,
            EStatus.Start,
            queryCID,
            query.name,
          ),
        );
        return this.balanceQueryEvaluator
          .eval(query, queryCID)
          .map((result) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.BalanceEvaluation,
                EStatus.End,
                queryCID,
                query.name,
              ),
            );
            return result;
          })
          .mapErr((err) => {
            new QueryPerformanceEvent(
              EQueryEvents.BalanceEvaluation,
              EStatus.End,
              queryCID,
              query.name,
              err,
            );
            return err;
          });
      } else if (query instanceof AST_NftQuery) {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.NftDataEvaluation,
            EStatus.Start,
            queryCID,
            query.name,
          ),
        );
        return this.nftQueryEvaluator
          .eval(query, queryCID, queryTimestamp)
          .map((result) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.NftDataEvaluation,
                EStatus.End,
                queryCID,
                query.name,
              ),
            );
            return result;
          })
          .mapErr((err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.NftDataEvaluation,
                EStatus.End,
                queryCID,
                query.name,
                err,
              ),
            );
            return err;
          });
      } else if (query instanceof AST_Web3AccountQuery) {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.Web3AccountEvaluation,
            EStatus.Start,
            queryCID,
            query.name,
          ),
        );
        return this.web3AccountQueryEvaluator
          .eval(query, queryCID)
          .map((result) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.Web3AccountEvaluation,
                EStatus.End,
                queryCID,
                query.name,
              ),
            );
            return result;
          })
          .mapErr((err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.Web3AccountEvaluation,
                EStatus.End,
                queryCID,
                query.name,
                err,
              ),
            );
            return err;
          });
      } else if (query instanceof AST_PropertyQuery) {
        return this.evalPropertyQuery(query, context.publicEvents, queryCID);
      } else if (query instanceof AST_QuestionnaireQuery) {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.QuestionnaireEvaluation,
            EStatus.Start,
            queryCID,
            query.name,
          ),
        );
        return this.questionnaireRepo.getByCID(query.questionnaireIndex!).map((questionnaire) => {
          if (questionnaire == null){
            return SDQL_Return(null);
          }
          const insights = questionnaire?.answers.map((questionAnswer) => {
            return {
              index: questionAnswer.questionIndex,
              answer: questionAnswer.choice,
            }
          })
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.QuestionnaireEvaluation,
              EStatus.End,
              queryCID,
              query.name,
            ),
          );
          return SDQL_Return(insights);
        })
          .mapErr((err) => {
            new QueryPerformanceEvent(
              EQueryEvents.QuestionnaireEvaluation,
              EStatus.End,
              queryCID,
              query.name,
              err,
            );
            return err;
          });
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
    queryCID: IpfsCID,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    let result = SDQL_Return(true);
    switch (q.property) {
      case "age":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.AgeEvaluation,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.AgeDataAccess,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        return this.demographicDataRepo
          .getAge()
          .andThen((age) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.AgeDataAccess,
                EStatus.End,
                queryCID,
                q.name,
              ),
            );
            if (q.returnType === "boolean") {
              for (const condition of q.conditions) {
                result = result && this.evalPropertyConditon(age, condition);
              }
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(
                  EQueryEvents.AgeEvaluation,
                  EStatus.End,
                  queryCID,
                  q.name,
                ),
              );
              return okAsync(result);
            } else {
              publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(
                  EQueryEvents.AgeEvaluation,
                  EStatus.End,
                  queryCID,
                  q.name,
                ),
              );
              return okAsync(SDQL_Return(age));
            }
          })
          .mapErr((err) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.AgeEvaluation,
                EStatus.End,
                queryCID,
                q.name,
                err,
              ),
            );
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.AgeDataAccess,
                EStatus.End,
                queryCID,
                q.name,
                err,
              ),
            );
            return err;
          });
      case "location":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.LocationEvaluation,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.LocationDataAccess,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        return this.demographicDataRepo
          .getLocation()
          .andThen((location) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.LocationDataAccess,
                EStatus.End,
                queryCID,
                q.name,
              ),
            );
            switch (q.returnType) {
              case "string":
                result = SDQL_Return(location);
                publicEvents.queryPerformance.next(
                  new QueryPerformanceEvent(
                    EQueryEvents.LocationEvaluation,
                    EStatus.End,
                    queryCID,
                    q.name,
                  ),
                );
                return okAsync(result);
              case "boolean":
                for (const condition of q.conditions) {
                  result =
                    result && this.evalPropertyConditon(location, condition);
                }
                publicEvents.queryPerformance.next(
                  new QueryPerformanceEvent(
                    EQueryEvents.LocationEvaluation,
                    EStatus.End,
                    queryCID,
                    q.name,
                  ),
                );
                return okAsync(result);
              case "integer":
                result = SDQL_Return(location);
                publicEvents.queryPerformance.next(
                  new QueryPerformanceEvent(
                    EQueryEvents.LocationEvaluation,
                    EStatus.End,
                    queryCID,
                    q.name,
                  ),
                );
                return okAsync(result);
              default:
                publicEvents.queryPerformance.next(
                  new QueryPerformanceEvent(
                    EQueryEvents.LocationEvaluation,
                    EStatus.End,
                    queryCID,
                    q.name,
                  ),
                );
                return okAsync(result);
            }
          })
          .mapErr((err) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.LocationEvaluation,
                EStatus.End,
                queryCID,
                q.name,
                err,
              ),
            );
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.LocationDataAccess,
                EStatus.End,
                queryCID,
                q.name,
                err,
              ),
            );
            return err;
          });
      case "gender":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.GenderEvaluation,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.GenderDataAccess,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        return this.demographicDataRepo
          .getGender()
          .andThen((gender) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.GenderDataAccess,
                EStatus.End,
                queryCID,
                q.name,
              ),
            );
            switch (q.returnType) {
              case "enum":
                if (q.enum_keys) {
                  for (const key of q.enum_keys) {
                    if (key == gender) {
                      publicEvents.queryPerformance.next(
                        new QueryPerformanceEvent(
                          EQueryEvents.GenderEvaluation,
                          EStatus.End,
                          queryCID,
                          q.name,
                        ),
                      );
                      return okAsync(SDQL_Return(gender));
                    }
                  }
                }
                publicEvents.queryPerformance.next(
                  new QueryPerformanceEvent(
                    EQueryEvents.GenderEvaluation,
                    EStatus.End,
                    queryCID,
                    q.name,
                  ),
                );
                return okAsync(SDQL_Return(Gender("unknown")));
              default:
                publicEvents.queryPerformance.next(
                  new QueryPerformanceEvent(
                    EQueryEvents.GenderEvaluation,
                    EStatus.End,
                    queryCID,
                    q.name,
                  ),
                );
                return okAsync(result);
            }
          })
          .mapErr((err) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.GenderEvaluation,
                EStatus.End,
                queryCID,
                q.name,
                err,
              ),
            );
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.GenderDataAccess,
                EStatus.End,
                queryCID,
                q.name,
                err,
              ),
            );
            return err;
          });
      case "url_visited_count":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.BrowserActivityEvaluation,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.BrowserActivityDataAccess,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        return this.browsingDataRepo
          .getSiteVisitsMap(q.timestampRange!)
          .mapErr((err) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.BrowserActivityEvaluation,
                EStatus.End,
                queryCID,
                q.name,
                err,
              ),
            );
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.BrowserActivityDataAccess,
                EStatus.End,
                queryCID,
                q.name,
                err,
              ),
            );
            return err;
          })

          .map((url_visited_count) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.BrowserActivityDataAccess,
                EStatus.End,
                queryCID,
                q.name,
              ),
            );
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.BrowserActivityEvaluation,
                EStatus.End,
                queryCID,
                q.name,
              ),
            );
            return SDQL_Return(this.mapToRecord(url_visited_count));
          });
      case "social_discord":
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.DiscordEvaluation,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.DiscordDataAccess,
            EStatus.Start,
            queryCID,
            q.name,
          ),
        );
        return this.getDiscordProfiles()
          .map((res) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.DiscordDataAccess,
                EStatus.End,
                queryCID,
                q.name,
              ),
            );
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.DiscordEvaluation,
                EStatus.End,
                queryCID,
                q.name,
              ),
            );
            return res;
          })
          .mapErr((err) => {
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.DiscordEvaluation,
                EStatus.Start,
                queryCID,
                q.name,
                err,
              ),
            );
            publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.DiscordDataAccess,
                EStatus.Start,
                queryCID,
                q.name,
                err,
              ),
            );
            return err;
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
      // return err ;
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

  protected mapToRecord<K extends string, V>(map: Map<K, V>): Record<K, V> {
    const obj: any = {};
    map.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  protected getDiscordProfiles(): ResultAsync<SDQL_Return, PersistenceError> {
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

  protected getTwitterFollowers(): ResultAsync<SDQL_Return, PersistenceError> {
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
