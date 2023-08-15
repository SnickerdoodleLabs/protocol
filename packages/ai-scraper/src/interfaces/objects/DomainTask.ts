import { DomainName } from "@snickerdoodlelabs/objects";

import { ETask } from "@ai-scraper/interfaces/enums/ETask.js";

export class DomainTask {
  constructor(readonly domain: DomainName, readonly taskType: ETask) {}
}
