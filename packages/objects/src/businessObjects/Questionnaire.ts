import {
  IpfsCID,
  MarketplaceTag,
  QuestionnaireAnswerId,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export enum EQuestionnaireStatus {
  Available,
  Complete,
}

export enum EQuestionnaireQuestionType {
  MultipleChoice = "Multiple Choice",
  Location = "Location",
  Text = "Text",
}

export class Questionnaire {
  public constructor(
    /**
     * The questionnaire is uniquely identified by it's CID in IPFS. This is the primary key for
     * questionnaires.
     */
    public readonly id: IpfsCID, // the location of the questionnaire in IPFS
    public readonly marketplaceTag: MarketplaceTag, // The tag that
    public readonly status: EQuestionnaireStatus,
    /// The questions are entirely part of the Questionnaire and not an independent object.
    public readonly questions: QuestionnaireQuestion[],
  ) {}
}

export class QuestionnaireWithAnswers extends Questionnaire {
  public constructor(
    id: IpfsCID,
    marketplaceTag: MarketplaceTag,
    status: EQuestionnaireStatus,
    questions: QuestionnaireQuestion[],

    // The answers are independent objects; they are included as part of the Questionnaire for
    // convenience, but they are not required to be included in the Questionnaire.
    public readonly answers: QuestionnaireAnswer[],
  ) {
    super(id, marketplaceTag, status, questions);
  }
}

export class QuestionnaireQuestion {
  public constructor(
    public readonly index: number,
    public readonly type: EQuestionnaireQuestionType,
    public readonly text: string,
    public readonly choices: string[] | null,
  ) {}
}

export class NewQuestionnaireAnswer {
  public constructor(
    public readonly questionnaireId: IpfsCID,
    public readonly questionIndex: number,
    public readonly choice: number,
    public readonly measurementDate: UnixTimestamp,
  ) {}
}
export class QuestionnaireAnswer extends NewQuestionnaireAnswer {
  public constructor(
    public readonly id: QuestionnaireAnswerId,
    public readonly questionnaireId: IpfsCID,
    public readonly questionIndex: number,
    public readonly choice: number,
    public readonly measurementDate: UnixTimestamp,
  ) {
    super(questionnaireId, questionIndex, choice, measurementDate);
  }
}
