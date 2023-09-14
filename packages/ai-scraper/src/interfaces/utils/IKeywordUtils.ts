import { ELanguageCode, ETask, Keyword } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IKeywordUtils {
  getTaskByKeywords(
    language: ELanguageCode,
    keywords: Set<Keyword>,
  ): ResultAsync<ETask, never>;
}

export const IKeywordUtilsType = Symbol.for("IKeywordUtils");
