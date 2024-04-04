/**
 * Important Note on Evaluation Events:
 *
 * The evaluation events also encompass data access events. For instance, if an age evaluation
 * takes 10ms and the corresponding age data access event takes 9ms, then the other processes
 * in the age query approximately consume 1ms.
 *
 * Please be aware that most of our asynchronous operations are CPU-bound. As a result, when
 * performing `Promise.all` on extensive operations, unexpected results may arise. Exercise
 * caution when leveraging these events for large queries.
 */
export enum EQueryEvents {
  /**
   * Will emit on `onQueryPosted` in QueryService:
   * Before creating a query record and requesting available rewards from MP,
   * we process the query and utilize the outcome to inquire about possible rewards.
   */
  OnQueryPostedEvaluationProcesses = "ProcessesBeforeQueryEvaluation",
  /**
   * Will emit on `returnQueries` in QueryService:
   * Prior to the final processing of the query, we perform certain preliminary tasks.
   * The processed result will subsequently be sent to the MP as the user's response to the query.
   */
  ProcessesBeforeReturningQueryEvaluation = "ProcessesBeforeQueryEvaluation",

  QuestionnaireEvaluation = "QuestionnaireEvaluation",
  QueryParsing = "QueryParsing",
  QueryEvaluation = "QueryEvaluation",
  AgeEvaluation = "AgeEvaluation",
  GenderEvaluation = "GenderEvaluation",
  LocationEvaluation = "LocationEvaluation",
  BrowserActivityEvaluation = "BrowserActivityEvaluation",
  ChainTransactionEvaluation = "ChainTransactionEvaluation",
  BalanceEvaluation = "BalanceEvaluation",
  NftDataEvaluation = "NftDataEvaluation",
  DiscordEvaluation = "DiscordEvaluation",
  AgeDataAccess = "AgeDataAccess",
  GenderDataAccess = "GenderDataAccess",
  LocationDataAccess = "LocationDataAccess",
  BrowserActivityDataAccess = "BrowserActivityDataAccess",
  ChainTransactionDataAccess = "ChainTransactionDataAccess",
  TransactionDataAccess = "TransactionDataAccess",
  BalanceDataAccess = "BalanceDataAccess",
  NftDataAccess = "NftDataAccess",
  DiscordDataAccess = "DiscordDataAccess",
  DappEvaluation = "DappEvaluation",
  Web3AccountDataAccess = "Web3AccountDataAccess",
  Web3AccountEvaluation = "Web3AccountEvaluation",

  MembershipProve = "MembershipProve",
}
