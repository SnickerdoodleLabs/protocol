import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { URLString, UnixTimestamp } from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

/**
 * I honestly don't know what we need to collect for clicks. I'm not a data guy. Presumeably,
 * you want to know where you clicked and when you did it.
 */

/**
 * Good place to play around with tests. You can use IndexedDB.test
 * to play around and see how it works
 */
export class ClickData extends VersionedObject {
  public static CURRENT_VERSION = 3;

  public constructor(
    public url: URLString,
    public timestamp: UnixTimestamp,
    public element: string,
    public version2Element: string,
    public version3Element: number,
  ) {
    super();
  }

  public getVersion(): number {
    return ClickData.CURRENT_VERSION;
  }
}

export class ClickDataMigrator extends VersionedObjectMigrator<ClickData> {
  public getCurrentVersion(): number {
    return ClickData.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<ClickData>): ClickData {
    return new ClickData(
      data.url,
      data.timestamp,
      data.element,
      data.version2Element,
      data.version3Element,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map([
      [
        1,
        (data: Partial<ClickData>) => {
          if (data.version2Element == null) {
            data.version2Element = "Default_Version2";
          }
          return data;
        },
      ],
      [
        2,
        (data: Partial<ClickData>) => {
          if (data.version3Element == null) {
            data.version3Element = 1;
          }
          return data;
        },
      ],
    ]);
  }
}
