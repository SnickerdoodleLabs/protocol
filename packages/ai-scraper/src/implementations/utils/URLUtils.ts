import { URLString, DomainName, HostName } from "@snickerdoodlelabs/objects";

import {
  IURLUtils,
  Keyword,
  KnownDomains,
  Task,
} from "@ai-scraper/interfaces/index.js";

export class URLUtils implements IURLUtils {
  public getHostname(url: URLString): HostName {
    return new URL(url).hostname;
  }
  public getDomain(url: URLString): DomainName {
    const hostname = this.getHostname(url);
    if (hostname.includes(KnownDomains.Amazon)) {
      return KnownDomains.Amazon;
    }

    return DomainName(hostname);
  }
  public getKeywords(url: URLString): Keyword[] {
    throw new Error("Method not implemented.");
  }
  public getHash(url: URLString): string {
    throw new Error("Method not implemented.");
  }
  public getTask(url: URLString): Task {
    // 1. get domain
    // 2. get keywords
    // 3. get task
    return Task.PurchaseHistory;
  }
}
