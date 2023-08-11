import {
  URLString,
  DomainName,
  HostName,
  HexString,
  Language,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { Task } from "@ai-scraper/interfaces/enums";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";

export interface IURLUtils {
  getHostname(url: URLString): ResultAsync<HostName, TypeError>;
  getDomain(url: URLString): ResultAsync<DomainName, TypeError>;
  getKeywords(
    url: URLString,
    language: Language,
  ): ResultAsync<Keyword[], TypeError>;
  getHash(
    url: URLString,
    language: Language,
  ): ResultAsync<HexString, TypeError>;
  getTask(url: URLString, language: Language): ResultAsync<Task, TypeError>;
}

export const IURLUtilsType = Symbol.for("IURLUtils");
