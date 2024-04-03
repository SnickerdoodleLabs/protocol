import Crypto from "crypto";

import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { PropertiesOf, QuestionnaireQuestion } from "@objects/index";
import { IpfsCID, SHA256Hash, URLString } from "@objects/primitives/index.js";

export class QuestionnaireData extends VersionedObject {
  public static CURRENT_VERSION = 2;

  public constructor(
    public id: IpfsCID,
    public questions: PropertiesOf<QuestionnaireQuestion>[],
    public title: string,
    public questionHashes: [number, SHA256Hash][],
    public description?: string,
    public image?: URLString,
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
      data.questionHashes,
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

          data.questionHashes = data.questions?.map((question, index) => {
            const questionString = JSON.stringify(question, (key, value) => {
              if (value instanceof Map) {
                return {
                  dataType: "Map",
                  value: Array.from(value.entries()),
                };
              } else if (value instanceof Set) {
                return {
                  dataType: "Set",
                  value: [...value],
                };
              } else if (value instanceof BigInt) {
                return {
                  dataType: "BigInt",
                  value: value.toString(),
                };
              } else if (typeof value == "bigint") {
                return {
                  dataType: "bigint",
                  value: BigInt(value).toString(),
                };
              } else {
                return value;
              }
            });

            const questionHash = Crypto.createHash("sha256")
              .update(questionString)
              .digest("hex");

            return [index, SHA256Hash(questionHash)] as [number, SHA256Hash];
          });
          return data;
        },
      ],
    ]);
  }
}
