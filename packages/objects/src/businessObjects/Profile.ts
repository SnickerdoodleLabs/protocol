import { MarketplaceTag } from "@objects/primitives/index.js";

export enum EProfileStatus {
  Available,
  Complete,
}

export class Questionnaire {
  public constructor(
    public readonly id: string, // todo, not string
    public readonly marketplaceTag: MarketplaceTag,
    public readonly status: EProfileStatus,
  ) {}
}

export class QuestionnaireQuestion {
  public constructor(
    public readonly id: string,
    public readonly questionaireId: string,
    public readonly text: string,
  ) {}
}

export class QuestionaireAnswer {
  public constructor(
    public readonly id: string,
    public readonly questionId: string,
    public readonly text: string,
  ) {}
}
