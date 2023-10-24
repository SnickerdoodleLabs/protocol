import {
  URLString,
  DomainName,
  HostName,
  HexString,
  ELanguageCode,
} from "@snickerdoodlelabs/objects";
import { Result, ResultAsync } from "neverthrow";

import { IKeywordRepository } from "@ai-scraper/interfaces/data/IKeywordRepository.js";
import { ETask } from "@ai-scraper/interfaces/enums/ETask.js";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";

export interface IURLUtils {
  getHostname(url: URLString): ResultAsync<HostName, TypeError>;
  getDomain(url: URLString): ResultAsync<DomainName, TypeError>;
  getKeywords(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<Set<Keyword>, TypeError>;
  getHash(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<HexString, TypeError>;
  getTask(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<ETask, TypeError>;
}

export const IURLUtilsType = Symbol.for("IURLUtils");
