import {
  URLString,
  DomainName,
  HostName,
  HexString,
  ELanguageCode,
  EKnownDomains,
  ETask,
  Keyword,
  InvalidURLError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { Result, ResultAsync, err, errAsync, ok, okAsync } from "neverthrow";

import {
  IKeywordRepository,
  IKeywordUtils,
  IKeywordUtilsType,
  IURLUtils,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class URLUtils implements IURLUtils {
  public constructor(
    @inject(IKeywordUtilsType)
    private keywordUtils: IKeywordUtils,
  ) {}

  public isValid(url: URLString): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
  public getHostname(url: URLString): ResultAsync<HostName, InvalidURLError> {
    try {
      return okAsync(HostName(new URL(url).hostname));
    } catch (error) {
      return errAsync(new InvalidURLError((error as Error).message));
    }
  }

  public getDomain(url: URLString): ResultAsync<DomainName, InvalidURLError> {
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
  ): ResultAsync<Set<Keyword>, InvalidURLError> {
    // keywords are in the path or in search params
    const uniqueKeywords = new Set<Keyword>();

    const urlObj = new URL(url);
    const pathName = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    const pathWords = pathName.split("/").map((keyword) => Keyword(keyword));
    pathWords.forEach((keyword) => uniqueKeywords.add(Keyword(keyword)));

    searchParams.forEach((value, key) => {
      uniqueKeywords.add(Keyword(value));
      uniqueKeywords.add(Keyword(key));
    });

    return okAsync(uniqueKeywords);
  }
  public getHash(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<HexString, InvalidURLError> {
    throw new Error("Method not implemented.");
  }

  public getTask(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<ETask, InvalidURLError> {
    // 1. get domain
    // 2. get urlKeywords
    // 3. get task

    return this.getKeywords(url, language).andThen((urlKeywords) => {
      return this.keywordUtils.getTaskByKeywords(language, urlKeywords);
    });
  }
}
