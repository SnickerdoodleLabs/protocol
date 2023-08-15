import {
  URLString,
  DomainName,
  HostName,
  HexString,
  ELanguageCode,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { Result, ResultAsync, err, errAsync, ok, okAsync } from "neverthrow";

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

  public getHostname(url: URLString): Result<HostName, TypeError> {
    try {
      return ok(HostName(new URL(url).hostname));
    } catch (error) {
      return err(error as TypeError);
    }
  }

  public getDomain(url: URLString): Result<DomainName, TypeError> {
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
  ): Result<Set<Keyword>, TypeError> {
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

    return ok(uniqueKeywords);
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

    return this.getKeywords(url, language).asyncAndThen((urlKeywords) => {
      return this.keywordUtils.getTaskByKeywords(
        keywordRepository,
        language,
        urlKeywords,
      );
    });
  }
}
