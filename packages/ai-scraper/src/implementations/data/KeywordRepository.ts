import { IpfsCID, JSONString, ELanguageCode } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { DefaultKeywords } from "@ai-scraper/data/index.js";
import {
  Keyword,
  ETask,
  IKeywordRepository,
  Keywords,
  TaskKeywords,
} from "@ai-scraper/interfaces/index.js";

/**
 * @class KeywordRepository
 * @description: This is a cached repository of keywords that can be updated from IPFS CID
 */
@injectable()
export class KeywordRepository implements IKeywordRepository {
  protected keywords: Keywords;
  constructor() {
    this.keywords = JSON.parse(DefaultKeywords) as Keywords;
  }
  public updateFromIPFS(cid: IpfsCID): ResultAsync<void, Error> {
    throw new Error("Method not implemented.");
  }

  public updateKeywords(jsonString: JSONString): void {
    this.keywords = JSON.parse(jsonString) as Keywords;
  }
  public getKeywords(language: ELanguageCode): TaskKeywords {
    return this.keywords[language];
  }

  public hasTaskKeywords(language: ELanguageCode, taskType: ETask): boolean {
    return taskType.valueOf() in this.keywords[language];
  }
  public getKeywordsByTask(
    language: ELanguageCode,
    taskType: ETask,
  ): Set<Keyword> {
    if (!this.hasTaskKeywords(language, taskType)) {
      return new Set<Keyword>();
    }
    return new Set(this.getKeywords(language)[taskType.valueOf()]);
  }
}
