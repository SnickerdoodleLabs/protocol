import {
  IpfsCID,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";

export class QueryMetaData {
  public constructor(
    public name: string,
    public points: number,
    public image: IpfsCID | undefined,
    public description: string,
    public questionnaires: (Questionnaire | QuestionnaireWithAnswers)[],
  ) {}
}
