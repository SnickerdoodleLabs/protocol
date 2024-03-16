import { DomainTask } from "@objects/businessObjects/scraper/DomainTask.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { ETask } from "@objects/enum/scraper/ETask.js";
import {
  DomainName,
  HTMLString,
  URLString,
  UnixTimestamp,
  WebPageText,
} from "@objects/primitives/index.js";

export class ScraperJob extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    readonly url: URLString,
    readonly html: HTMLString,
    readonly domainTask: DomainTask,
    readonly startTime: UnixTimestamp,
    public endTime: UnixTimestamp | null,
    public text: WebPageText | null,
  ) {
    super();
  }

  public getVersion(): number {
    return ScraperJob.CURRENT_VERSION;
  }
}

export class ScraperJobMigrator extends VersionedObjectMigrator<ScraperJob> {
  public getCurrentVersion(): number {
    return ScraperJob.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): ScraperJob {
    const domainTaskSerialized = data["domainTask"] as {
      domain: string;
      taskType: string;
    };
    const domainTask = new DomainTask(
      DomainName(domainTaskSerialized["domain"]),
      ETask[domainTaskSerialized["taskType"]],
    );
    return new ScraperJob(
      data["url"] as URLString,
      data["html"] as HTMLString,
      domainTask,
      data["startTime"] as UnixTimestamp,
      data["endTime"] as UnixTimestamp,
      data["text"] as WebPageText,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
