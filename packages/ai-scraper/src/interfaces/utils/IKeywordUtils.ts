import { ELanguageCode } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IKeywordRepository } from "@ai-scraper/interfaces/data/IKeywordRepository.js";
import { ETask } from "@ai-scraper/interfaces/enums/ETask.js";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";

export interface IKeywordUtils {
  getTaskByKeywords(
    keywordRepository: IKeywordRepository,
    language: ELanguageCode,
    keywords: Keyword[],
  ): ResultAsync<ETask, never>;
}

export const IKeywordUtilsType = Symbol.for("IKeywordUtils");
