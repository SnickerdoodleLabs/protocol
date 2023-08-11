import { IpfsCID, JSONString, LanguageCode } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow/dist";

import { DefaultKeywords } from "@ai-scraper/data";
import { IKeywordUtils, Keyword, Task } from "@ai-scraper/interfaces";
import { Keywords } from "@ai-scraper/interfaces/Keywords";
import { TaskKeywords } from "@ai-scraper/interfaces/TaskKeywords";

export class KeywordUtils implements IKeywordUtils {
  protected keywords: Keywords;
  constructor() {
    this.keywords = JSON.parse(DefaultKeywords) as Keywords;
  }
  matchTask(
    languageCode: LanguageCode,
    keywords: Keyword[],
  ): ResultAsync<Task, never> {
    throw new Error("Method not implemented.");
  }
  public updateFromIPFS(cid: IpfsCID) {
    throw new Error("Method not implemented.");
  }

  public updateKeywords(jsonString: JSONString): void {
    this.keywords = JSON.parse(jsonString) as Keywords;
  }
  public getKeywords(languageCode: LanguageCode): TaskKeywords {
    return this.keywords[languageCode];
  }
  public getKeywordsByTask(languageCode: LanguageCode, task: Task): Keyword[] {
    return this.keywords[languageCode][task];
  }
}
