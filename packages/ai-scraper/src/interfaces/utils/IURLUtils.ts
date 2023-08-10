import {
  URLString,
  DomainName,
  HostName,
  HexString,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { Task } from "@ai-scraper/interfaces/enums";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";

export interface IURLUtils {
  getHostname(url: URLString): ResultAsync<HostName, TypeError>;
  getDomain(url: URLString): ResultAsync<DomainName, TypeError>;
  getKeywords(
    url: URLString,
    languageCode: LanguageCode,
  ): ResultAsync<Keyword[], TypeError>;
  getHash(url: URLString): ResultAsync<HexString, TypeError>;
  getTask(url: URLString): ResultAsync<Task, TypeError>;
}

export const IURLUtilsType = Symbol.for("IURLUtils");
