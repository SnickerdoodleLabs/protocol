import {
    SDQL_Name,
    EQuestionnaireQuestionType,
    IpfsCID,
  } from "@snickerdoodlelabs/objects";
  
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