import { ETask } from "@objects/enum/scraper/ETask.js";
import { DomainName } from "@objects/primitives/DomainName.js";

export class DomainTask {
  constructor(readonly domain: DomainName, readonly taskType: ETask) {}
}
