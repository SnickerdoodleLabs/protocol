import {
  URLString,
  DomainName,
  HostName,
  HexString,
  ELanguageCode,
  ETask,
  Keyword,
} from "@snickerdoodlelabs/objects";
import { Result, ResultAsync } from "neverthrow";

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
