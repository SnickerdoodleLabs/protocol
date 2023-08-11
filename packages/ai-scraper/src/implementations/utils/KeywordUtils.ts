import {
  IpfsCID,
  JSONString,
  Language,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, okAsync } from "neverthrow";

import { DefaultKeywords } from "@ai-scraper/data";
import { IKeywordUtils, Keyword, Task } from "@ai-scraper/interfaces";
import { Keywords } from "@ai-scraper/interfaces/Keywords";
import { TaskKeywords } from "@ai-scraper/interfaces/TaskKeywords";

export class KeywordUtils implements IKeywordUtils {
  protected keywords: Keywords;
  constructor() {
    this.keywords = JSON.parse(DefaultKeywords) as Keywords;
  }
  matchTask(language: Language, keywords: Keyword[]): ResultAsync<Task, never> {
    // returns the first matched task only
    for (const task in Task) {
      if (this.hasTaskKeywords(language, Task[task])) {
        const taskKeywords = this.getKeywordsByTask(language, Task[task]);

        // TODO optimize this with a trie
        for (const keyword of keywords) {
          if (taskKeywords.includes(keyword)) {
            return okAsync(Task[task]);
          }
        }
      }
    }
    return okAsync(Task.Unknown);
  }
  public updateFromIPFS(cid: IpfsCID) {
    throw new Error("Method not implemented.");
  }

  public updateKeywords(jsonString: JSONString): void {
    this.keywords = JSON.parse(jsonString) as Keywords;
  }
  public getKeywords(language: Language): TaskKeywords {
    return this.keywords[language];
  }

  public hasTaskKeywords(language: Language, task: Task): boolean {
    return task.valueOf() in this.keywords[language];
  }
  public getKeywordsByTask(language: Language, task: Task): Keyword[] {
    return this.keywords[language][task.valueOf()];
  }
}
