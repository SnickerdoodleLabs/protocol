import {
    SDQL_Name,
    ISDQLQuestionBlock,
    EQuestionnaireQuestionType,
    IpfsCID,
  } from "@snickerdoodlelabs/objects";
  import { AST_QuestionnaireQuery } from "@query-parser/interfaces/objects/AST_QuestionnaireQuery.js";
  
export class AST_Question {
  constructor(
    readonly question: SDQL_Name,
    readonly questionType: EQuestionnaireQuestionType,
    readonly possibleResponses: string[],
    readonly questionnaireIndex: IpfsCID,
    readonly questionIndex: number,
    readonly answer: string | number | undefined,
  ) {}
}