import { ELanguageCode } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { DefaultKeywords } from "@ai-scraper/data/index.js";
import {
  IKeywordUtils,
  Keyword,
  ETask,
  Keywords,
  IKeywordRepository,
  IKeywordRepositoryType,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class KeywordUtils implements IKeywordUtils {
  constructor(
    @inject(IKeywordRepositoryType)
    readonly keywordRepository: IKeywordRepository,
  ) {}
  public getTaskByKeywords(
    language: ELanguageCode,
    keywords: Set<Keyword>,
  ): ResultAsync<ETask, never> {
    // returns the first matched taskType only
    for (const taskType in ETask) {
      const taskKeywords = this.keywordRepository.getKeywordsByTask(
        language,
        ETask[taskType],
      );

      // console.log("taskType", taskType);
      // console.log("taskKeywords", taskKeywords);

      // TODO optimize this with a trie
      for (const keyword of keywords) {
        if (taskKeywords.has(keyword)) {
          return okAsync(ETask[taskType]);
        }
      }
    }
    return okAsync(ETask.Unknown);
  }
}
