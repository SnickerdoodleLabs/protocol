import {
  URLString,
  DomainName,
  HostName,
  HexString,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IKeywordUtils,
  IKeywordUtilsType,
  IURLUtils,
  Keyword,
  KnownDomains,
  Task,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class URLUtils implements IURLUtils {
  public constructor(
    @inject(IKeywordUtilsType)
    private keywordUtils: IKeywordUtils,
  ) {}

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

  public getKeywords(
    url: URLString,
    languageCode: LanguageCode,
  ): ResultAsync<Keyword[], TypeError> {
    // keywords are in the path or in search params
    const urlObj = new URL(url);
    const pathName = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    const keywords = pathName.split("/").map((keyword) => Keyword(keyword));
    searchParams.forEach((value, key) => {
      keywords.push(Keyword(value));
      keywords.push(Keyword(key));
    });

    return okAsync(keywords);
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
