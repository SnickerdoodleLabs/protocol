import {
    SDQL_Name,
    QuestionnaireQuestionTypes,
    questionnaireQuestionTypes,
    EQuestionnaireQuestionType,
  } from "@snickerdoodlelabs/objects";
    
  export abstract class AST_Question {
    constructor(
      readonly question: SDQL_Name,
      readonly questionType: EQuestionnaireQuestionType,
      readonly possibleResponses: string[],
    ) {
    }
  
    static identifyQuestionnaireType(
      questionnaireType: string,
    ): QuestionnaireQuestionTypes | undefined {
      return questionnaireQuestionTypes.find((validType) => {
        return validType === questionnaireType;
      });
    }  
  }
  