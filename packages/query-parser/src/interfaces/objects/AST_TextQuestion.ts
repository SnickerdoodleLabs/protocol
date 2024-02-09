import {
    SDQL_Name,
    ISDQLQuestionBlock,
    EQuestionnaireQuestionType,
  } from "@snickerdoodlelabs/objects";
  import { AST_Question } from "@query-parser/interfaces/objects/AST_Question.js";

  import { ok, Result } from "neverthrow";
  
  export class AST_TextQuestion extends AST_Question {
    constructor(
        readonly question: SDQL_Name,
        readonly questionType: EQuestionnaireQuestionType,
        readonly possibleResponses: string[],
      ) {
        super(question, questionType, possibleResponses);
      }
    
      static fromSchema(name: SDQL_Name, schema: ISDQLQuestionBlock): AST_TextQuestion {
        return new AST_TextQuestion(name, EQuestionnaireQuestionType.Text, schema.options);
      }
  }