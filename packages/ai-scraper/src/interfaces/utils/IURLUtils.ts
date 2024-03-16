import {
  URLString,
  DomainName,
  HostName,
  HexString,
  ELanguageCode,
  ETask,
  Keyword,
  InvalidURLError,
} from "@snickerdoodlelabs/objects";
import { Result, ResultAsync } from "neverthrow";

export interface IURLUtils {
  getHostname(url: URLString): ResultAsync<HostName, InvalidURLError>;
  getDomain(url: URLString): ResultAsync<DomainName, InvalidURLError>;
  getKeywords(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<Set<Keyword>, InvalidURLError>;
  getHash(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<HexString, InvalidURLError>;
  getTask(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<ETask, InvalidURLError>;
}

export const IURLUtilsType = Symbol.for("IURLUtils");
