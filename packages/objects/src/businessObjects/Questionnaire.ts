import {
  IpfsCID,
  MarketplaceTag,
  QuestionnaireAnswerId,
  URLString,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export enum EQuestionnaireStatus {
  Available,
  Complete,
}

export enum EQuestionnaireQuestionType {
  MultipleChoice = "MultipleChoice",
  Location = "Location",
  Text = "Text",
  Numeric = "Numeric",
}

export enum EQuestionnaireQuestionDisplayType {
  Dropdown = "Dropdown",
  List = "List",
  Scale = "Scale",
}

export class Questionnaire {
  public constructor(
    /**I
     * The questionnaire is uniquely identified by it's CID in IPFS. This is the primary key for
     * questionnaires.
     */
    public readonly id: IpfsCID, // the location of the questionnaire in IPFS
    public readonly marketplaceTag: MarketplaceTag, // The tag that
    public readonly status: EQuestionnaireStatus,
    public readonly title: string,
    public readonly description: string | null,
    public readonly image: URLString | null,
    /// The questions are entirely part of the Questionnaire and not an independent object.
    public readonly questions: QuestionnaireQuestion[],

    // The answers are independent objects; they are included as part of the Questionnaire for
    // convenience, but they are not required to be included in the Questionnaire.
  ) {}
}

export class QuestionnaireWithAnswers extends Questionnaire {
  public constructor(
    id: IpfsCID,
    marketplaceTag: MarketplaceTag,
    status: EQuestionnaireStatus,
    title: string,
    description: string | null,
    image: URLString | null,
    questions: QuestionnaireQuestion[],

    // The answers are independent objects; they are included as part of the Questionnaire for
    // convenience, but they are not required to be included in the Questionnaire.
    public readonly answers: QuestionnaireAnswer[],
    public measurementTime: UnixTimestamp,
  ) {
    super(id, marketplaceTag, status, title, description, image, questions);
  }
}

export class QuestionnaireQuestion {
  public constructor(
    public readonly index: number,
    public readonly type: EQuestionnaireQuestionType,
    public readonly text: string,
    public readonly choices: string[] | number[] | null,
    public readonly minimum: number | null,
    public readonly maximum: number | null,
    public readonly displayType: EQuestionnaireQuestionDisplayType | null,
    public readonly multiSelect: boolean = false,
    public readonly required: boolean = false,
    public readonly lowerLabel: string | null = null,
    public readonly upperLabel: string | null = null,
  ) {}
}

export class NewQuestionnaireAnswer {
  public constructor(
    public readonly questionnaireId: IpfsCID,
    public readonly questionIndex: number,
    public readonly choice: number | string | number[] | string[],
  ) {}
}
export class QuestionnaireAnswer extends NewQuestionnaireAnswer {
  public constructor(
    public readonly questionnaireId: IpfsCID,
    public readonly questionIndex: number,
    public readonly choice: number | string | number[] | string[],
  ) {
    super(questionnaireId, questionIndex, choice);
  }
}
