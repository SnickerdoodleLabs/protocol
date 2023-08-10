import { DomainName } from "@snickerdoodlelabs/objects";

import { Task } from "@ai-scraper/interfaces/enums/Task.js";

export class DomainTask {
  constructor(readonly domain: DomainName, readonly task: Task) {}
}
