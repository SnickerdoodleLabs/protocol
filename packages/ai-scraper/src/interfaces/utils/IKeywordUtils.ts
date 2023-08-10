import { IpfsCID, LanguageCode } from "@snickerdoodlelabs/objects";

import { Task } from "@ai-scraper/interfaces/enums/Task.js";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";

export interface IKeywordUtils {
  updateFromIPFS(cid: IpfsCID);
  getKeywords(languageCode: LanguageCode): Keyword[];
  getKeywordsByTask(languageCode: LanguageCode, task: Task): Keyword[];
}

export const IKeywordUtilsType = Symbol.for("IKeywordUtils");
