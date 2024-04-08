import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { PropertiesOf, QuestionnaireAnswer } from "@objects/index";
import {
  IpfsCID,
  SHA256Hash,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class QuestionnaireHistory extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: SHA256Hash,
    public measurementDate: UnixTimestamp,
    public answer: PropertiesOf<QuestionnaireAnswer["choice"]>,
  ) {
    super();
  }

  public getVersion(): number {
    return QuestionnaireHistory.CURRENT_VERSION;
  }
}

export class QuestionnaireHistoryMigrator extends VersionedObjectMigrator<QuestionnaireHistory> {
  public getCurrentVersion(): number {
    return QuestionnaireHistory.CURRENT_VERSION;
  }

  protected factory(
    data: PropertiesOf<QuestionnaireHistory>,
  ): QuestionnaireHistory {
    return new QuestionnaireHistory(data.id, data.measurementDate, data.answer);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
