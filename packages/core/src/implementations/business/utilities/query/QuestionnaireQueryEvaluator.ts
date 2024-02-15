import {
    IBigNumberUtils,
    IBigNumberUtilsType,
  } from "@snickerdoodlelabs/common-utils";
  import { MasterIndexer } from "@snickerdoodlelabs/indexers";
  import {
    AjaxError,
    BigNumberString,
    ChainId,
    EQueryEvents,
    EStatus,
    EvalNotImplementedError,
    ISDQLQuestionBlock,
    InvalidParametersError,
    IpfsCID,
    PersistenceError,
    PublicEvents,
    QueryPerformanceEvent,
    SDQL_Return,
    TokenAddress,
    TokenBalance,
    TokenBalanceInsight,
  } from "@snickerdoodlelabs/objects";
  import {
    AST_BalanceQuery,
    ConditionE,
    ConditionG,
    ConditionGE,
    ConditionL,
    ConditionLE,
    AST_QuestionnaireQuery,
    AST_Question,
  } from "@snickerdoodlelabs/query-parser";
  import { inject, injectable } from "inversify";
  import { errAsync, okAsync, ResultAsync } from "neverthrow";
  
  import { IQuestionnaireQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";
  import {
    IPortfolioBalanceRepository,
    IPortfolioBalanceRepositoryType,
    IQuestionnaireRepository,
    IQuestionnaireRepositoryType,
  } from "@core/interfaces/data/index.js";
  import {
    IContextProviderType,
    IContextProvider,
  } from "@core/interfaces/utilities/index.js";
import { ResultUtils } from "neverthrow-result-utils";
  
  @injectable()
  export class QuestionnaireQueryEvaluator implements IQuestionnaireQueryEvaluator {
    constructor(
      @inject(IPortfolioBalanceRepositoryType)
      protected balanceRepo: IPortfolioBalanceRepository,
      @inject(IBigNumberUtilsType) protected bigNumberUtils: IBigNumberUtils,
      @inject(IContextProviderType)
      protected contextProvider: IContextProvider,
      @inject(IQuestionnaireRepositoryType)
      protected questionnaireRepo: IQuestionnaireRepository,
      // @inject(IIPF)
      // protected ipfsClient: IIP
    ) {}
  
    public eval(
      query: AST_QuestionnaireQuery,
      queryCID: IpfsCID,
    ): ResultAsync<SDQL_Return, PersistenceError> {
      return this.contextProvider.getContext().andThen((context) => {
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.QuestionnaireEvaluation,
            EStatus.Start,
            queryCID,
            query.name,
          ),
        );
        return this.questionnaireRepo.getByCID(query.questionnaireIndex!)
          .map((questionnaire) => {
            context.publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(
                  EQueryEvents.BalanceDataAccess,
                  EStatus.End,
                  queryCID,
                  query.name,
                ),
              );
        
            // CASE 1: Questionnaire is not found on the questionnaire repo, perhaps it is
            // on ipfs but not on the repo yet. 
            if (questionnaire == null) {
                // make ipfs call to fetch the questionnaire object
                //   return this.ipfsClient.get<IObject>(ipfsUrl).map(
                //     (IQuestionnaireObject) => {
                //      }).mapErr((e) => e)
                return (SDQL_Return("options 1"));
            }
            else
            // CASE 2: We did have the Questionnaire returned to us from the repo. 
            // Answers were not found
            if (questionnaire.answers == undefined) {
              return (SDQL_Return("options 2"));

            }
            else
            {
            // CASE 3: We did have the Questionnaire returned to us from the repo. 
            // The answers are included
            const insights = questionnaire.answers.map((answer) => {
                return {
                  "index": answer.questionIndex,
                  "answer": answer.choice,
                }
            })
            return (SDQL_Return(insights));
          }
          })
          .mapErr((err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.BalanceDataAccess,
                EStatus.End,
                queryCID,
                query.name,
                err,
              ),
            );
            return new PersistenceError(err.message);
          })
      });
    }

    private validateQuestion(question: ISDQLQuestionBlock): ResultAsync<void, InvalidParametersError> {
        if (
            question.question == null ||
            question.questionType == null
        ) {
            return errAsync(
            new InvalidParametersError(
                `Corrupted Question: ${question.question}`,
            ),
            );
        }
        return okAsync(undefined);
    }
    
    // private parseQuestion(
    //     questionBlock: ISDQLQuestionBlock,
    //     questionIndex: number,
    //   ): ResultAsync<
    //     AST_Question,
    //     DuplicateIdInSchema | QueryFormatError | MissingASTError
    //   > {
    //     if (questionBlock.questionType == EQuestionnaireQuestionType.MultipleChoice) {
    //       const mcQuestion = AST_MCQuestion.fromSchema(this.cid, questionIndex, SDQL_Name(questionBlock.question), questionBlock);
    //       this.saveInContext(SDQL_Name(questionBlock.question), mcQuestion);
    //       // this.questionsMap.set(SDQL_Name("qa" + questionIndex), mcQuestion);
    //       return okAsync(mcQuestion);
    //     } else {
    //       const textQuestion = AST_TextQuestion.fromSchema(this.cid, questionIndex, SDQL_Name(questionBlock.question), questionBlock);
    //       this.saveInContext(SDQL_Name(questionBlock.question), textQuestion);
    //       // this.questionsMap.set(SDQL_Name("qa" + questionIndex), textQuestion);
    //       return okAsync(textQuestion);
    //     }
}