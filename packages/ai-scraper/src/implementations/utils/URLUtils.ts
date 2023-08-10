import {
  URLString,
  DomainName,
  HostName,
  HexString,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IURLUtils,
  Keyword,
  KnownDomains,
  Task,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class URLUtils implements IURLUtils {
  public getHostname(url: URLString): ResultAsync<HostName, TypeError> {
    try {
      return okAsync(HostName(new URL(url).hostname));
    } catch (error) {
      return errAsync(error as TypeError);
    }
  }
  public getDomain(url: URLString): ResultAsync<DomainName, TypeError> {
    return this.getHostname(url).map((hostname) => {
      if (hostname.includes(KnownDomains.Amazon)) {
        return DomainName(KnownDomains.Amazon);
      }

      return DomainName(hostname);
    });
  }

  public getKeywords(url: URLString): ResultAsync<Keyword[], TypeError> {
    // keywords are in the path or in search params
    const urlObj = new URL(url);
    const pathName = urlObj.pathname;
    const query = urlObj.search; // the whole get query
  }
  public getHash(url: URLString): ResultAsync<HexString, TypeError> {
    throw new Error("Method not implemented.");
  }

  public getTask(url: URLString): ResultAsync<Task, TypeError> {
    // 1. get domain
    // 2. get keywords
    // 3. get task
    return this.getDomain(url).map((domain) => {
      if (domain === KnownDomains.Amazon) {
        return Task.PurchaseHistory;
      }

      return Task.Unknown;
    });
  }
}
