import { ELanguageCode } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { DefaultKeywords } from "@ai-scraper/data/index.js";
import {
  IKeywordUtils,
  Keyword,
  ETask,
  Keywords,
  IKeywordRepository,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class KeywordUtils implements IKeywordUtils {
  protected keywords: Keywords;
  constructor() {
    this.keywords = JSON.parse(DefaultKeywords) as Keywords;
  }
  public getTaskByKeywords(
    keywordRepository: IKeywordRepository,
    language: ELanguageCode,
    keywords: Set<Keyword>,
  ): ResultAsync<ETask, never> {
    // returns the first matched taskType only
    for (const taskType in ETask) {
      const taskKeywords = keywordRepository.getKeywordsByTask(
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
