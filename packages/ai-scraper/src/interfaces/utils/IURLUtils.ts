import { URLString, DomainName, HostName } from "@snickerdoodlelabs/objects";

import { Task } from "@ai-scraper/interfaces/enums";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";

export interface IURLUtils {
  getHostname(url: URLString): HostName;
  getDomain(url: URLString): DomainName;
  getKeywords(url: URLString): Keyword[];
  getHash(url: URLString): string;
  getTask(url: URLString): Task;
}
