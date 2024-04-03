import Crypto from "crypto";

import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  EQuestionnaireStatus,
  PropertiesOf,
  QuestionnaireQuestion,
} from "@objects/index";
import { IpfsCID, SHA256Hash, URLString } from "@objects/primitives/index.js";

export class QuestionnaireData extends VersionedObject {
  public static CURRENT_VERSION = 2;

  public constructor(
    public id: IpfsCID,
    public questions: PropertiesOf<QuestionnaireQuestion>[],
    public title: string,
    //public questionHashes: SHA256Hash[],
    public description?: string,
    public image?: URLString, //Should contain hashes ? properties of
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
    return new Map([
      [
        1,
        (data: Partial<QuestionnaireData>) => {
          if ("status" in data) {
            delete data.status;
          }

          // data.questionHashes = data.questions?.map(() => {
          //   const questionString = ObjectUtils.serialize(question);

          //   const questionHash = Crypto.createHash("sha256")
          //     .update(questionString)
          //     .digest("hex");

          //   return SHA256Hash(questionHash);
          // });
          return data;
        },
      ],
    ]);
  }
}
