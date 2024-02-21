import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  EQuestionnaireStatus,
  PropertiesOf,
  QuestionnaireQuestion,
} from "@objects/index";
import { IpfsCID, URLString } from "@objects/primitives/index.js";

export class QuestionnaireData extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: IpfsCID,
    public status: EQuestionnaireStatus,
    public questions: PropertiesOf<QuestionnaireQuestion>[],
    public title: string,
    public description: string,
    public image?: URLString | null,
  ) {
    super();
  }

  public getVersion(): number {
    return QuestionnaireData.CURRENT_VERSION;
  }
}

export class QuestionnaireMigrator extends VersionedObjectMigrator<QuestionnaireData> {
  public getCurrentVersion(): number {
    return QuestionnaireData.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<QuestionnaireData>): QuestionnaireData {
    return new QuestionnaireData(
      data.id,
      data.status,
      data.questions,
      data.title,
      data.description,
      data.image,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
