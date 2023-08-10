import {
  URLString,
  DomainName,
  HostName,
  URLString,
  HexString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IURLUtils,
  Keyword,
  KnownDomains,
  Task,
} from "@ai-scraper/interfaces/index.js";

export class URLUtils implements IURLUtils {
  public getHostname(url: URLString): ResultAsync<HostName, TypeError> {
    try {
      return okAsync(new URL(url).hostname);
    } catch (error) {
      return errAsync(error as TypeError);
    }
  }
  public getDomain(url: URLString): ResultAsync<DomainName, TypeError> {
    return this.getHostname(url).map((hostname) => {
      if (hostname.includes(KnownDomains.Amazon)) {
        return okAsync(KnownDomains.Amazon);
      }

      return okAsync(DomainName(hostname));
    });
  }

  public getKeywords(url: URLString): ResultAsync<Keyword[], TypeError> {
    throw new Error("Method not implemented.");
  }
  public getHash(url: URLString): ResultAsync<HexString, TypeError> {
    throw new Error("Method not implemented.");
  }

  public getTask(url: URLString): ResultAsync<Task, TypeError> {
    // 1. get domain
    // 2. get keywords
    // 3. get task
    return okAsync(Task.PurchaseHistory);
  }
}
