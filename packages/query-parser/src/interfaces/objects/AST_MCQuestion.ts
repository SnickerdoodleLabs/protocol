import {
    SDQL_Name,
    ISDQLQuestionBlock,
    StorageKey,
    EQuestionnaireQuestionType,
    IpfsCID,
  } from "@snickerdoodlelabs/objects";

import { AST_Question } from "@query-parser/interfaces/objects/AST_Question.js";

export class AST_MCQuestion extends AST_Question {
  constructor(
    readonly question: SDQL_Name,
    readonly questionType: EQuestionnaireQuestionType.MultipleChoice,
    readonly possibleResponses: string[],
    readonly questionnaireIndex: IpfsCID,
    readonly questionIndex: number,
    readonly answer: string | number | undefined,
  ) {
    super(question, questionType, possibleResponses, questionnaireIndex, questionIndex, answer);
  }

  static fromSchema(questionnaireIndex: IpfsCID, questionIndex: number, name: SDQL_Name, schema: ISDQLQuestionBlock): AST_MCQuestion {
    return new AST_MCQuestion(name, EQuestionnaireQuestionType.MultipleChoice, schema.options, questionnaireIndex, questionIndex, undefined);
  }

  // static updateAnswer(answer: string | number) {
  //   this.answer = answer;
  // }
}
  