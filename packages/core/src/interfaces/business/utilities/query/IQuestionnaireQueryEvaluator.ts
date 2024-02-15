import {
    IpfsCID,
    PersistenceError,
    SDQL_Return,
  } from "@snickerdoodlelabs/objects";
  import { AST_QuestionnaireQuery } from "@snickerdoodlelabs/query-parser";
  import { ResultAsync } from "neverthrow";
  import { IQueryTypeEvaluator } from "@core/interfaces/business/utilities/query/IQueryTypeEvaluator.js";
  
  export interface IQuestionnaireQueryEvaluator extends IQueryTypeEvaluator {
    eval(
      query: AST_QuestionnaireQuery,
      queryCID: IpfsCID,
    ): ResultAsync<SDQL_Return, PersistenceError>;
  }
  
  export const IQuestionnaireQueryEvaluatorType = Symbol.for("IQuestionnaireQueryEvaluator");
  