import {
    SDQL_Name,
    QuestionnaireQuestionTypes,
    questionnaireQuestionTypes,
    ISDQLQuestionBlock,
    StorageKey,
    EQuestionnaireQuestionType,
  } from "@snickerdoodlelabs/objects";
    
  export abstract class AST_Question {
    constructor(
      readonly name: SDQL_Name,
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
  