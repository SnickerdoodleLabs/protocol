import { IpfsCID, LanguageCode } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow/dist";

import { Task } from "@ai-scraper/interfaces/enums/Task.js";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";
import { TaskKeywords } from "@ai-scraper/interfaces/TaskKeywords.js";

export interface IKeywordUtils {
  updateFromIPFS(cid: IpfsCID);
  getKeywords(languageCode: LanguageCode): TaskKeywords;
  getKeywordsByTask(languageCode: LanguageCode, task: Task): Keyword[];
  matchTask(
    languageCode: LanguageCode,
    keywords: Keyword[],
  ): ResultAsync<Task, never>;
}

export const IKeywordUtilsType = Symbol.for("IKeywordUtils");
