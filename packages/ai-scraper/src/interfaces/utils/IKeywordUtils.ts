import { IpfsCID, Language, LanguageCode } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { Task } from "@ai-scraper/interfaces/enums/Task.js";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";
import { TaskKeywords } from "@ai-scraper/interfaces/TaskKeywords.js";

export interface IKeywordUtils {
  updateFromIPFS(cid: IpfsCID);
  getKeywords(language: Language): TaskKeywords;
  getKeywordsByTask(language: Language, task: Task): Keyword[];
  matchTask(language: Language, keywords: Keyword[]): ResultAsync<Task, never>;
}

export const IKeywordUtilsType = Symbol.for("IKeywordUtils");
