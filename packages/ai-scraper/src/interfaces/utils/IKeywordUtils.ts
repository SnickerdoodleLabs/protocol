import { IpfsCID, LanguageCode } from "@snickerdoodlelabs/objects";

import { Task } from "@ai-scraper/interfaces/enums/Task.js";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";
import { TaskKeywords } from "@ai-scraper/interfaces/TaskKeywords.js";

export interface IKeywordUtils {
  updateFromIPFS(cid: IpfsCID);
  getKeywords(languageCode: LanguageCode): TaskKeywords;
  getKeywordsByTask(languageCode: LanguageCode, task: Task): Keyword[];
}

export const IKeywordUtilsType = Symbol.for("IKeywordUtils");
