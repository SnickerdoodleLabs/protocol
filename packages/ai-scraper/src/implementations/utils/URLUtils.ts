import {
  URLString,
  DomainName,
  HostName,
  HexString,
  ELanguageCode,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IKeywordRepository,
  IKeywordUtils,
  IKeywordUtilsType,
  IURLUtils,
  Keyword,
  EKnownDomains,
  ETask,
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
      if (hostname.includes(EKnownDomains.Amazon)) {
        return DomainName(EKnownDomains.Amazon);
      }

      return DomainName(hostname);
    });
  }

  public getKeywords(
    url: URLString,
    language: ELanguageCode,
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
  public getHash(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<HexString, TypeError> {
    throw new Error("Method not implemented.");
  }

  public getTask(
    keywordRepository: IKeywordRepository,
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<ETask, TypeError> {
    // 1. get domain
    // 2. get urlKeywords
    // 3. get task

    return this.getKeywords(url, language).andThen((urlKeywords) => {
      return this.keywordUtils.getTaskByKeywords(
        keywordRepository,
        language,
        urlKeywords,
      );
    });

    // const keywords = this.getKeywords(url, Language.English);
    // return this.keywordUtils.matchTask(Language.English, keywords);

    // return this.getDomain(url).map((domain) => {
    //   if (domain === KnownDomains.Amazon) {
    //     return Task.PurchaseHistory;
    //   }

    //   return Task.Unknown;
    // });
  }
}
