import {
    SDQL_Name,
    QuestionnaireQuestionTypes,
    questionnaireQuestionTypes,
    ISDQLQuestionBlock,
  } from "@snickerdoodlelabs/objects";
    
  export abstract class AST_Question {
    constructor(
      readonly name: SDQL_Name,
      readonly questionType: QuestionnaireQuestionTypes,
      readonly possibleResponse: Set<string>,
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
  