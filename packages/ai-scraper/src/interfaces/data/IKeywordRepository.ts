import { IpfsCID, ELanguageCode } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ETask } from "@ai-scraper/interfaces/enums/ETask.js";
import { Keyword } from "@ai-scraper/interfaces/primitives/Keyword.js";
import { TaskKeywords } from "@ai-scraper/interfaces/TaskKeywords.js";

export interface IKeywordRepository {
  updateFromIPFS(cid: IpfsCID): ResultAsync<void, Error>;
  getKeywords(language: ELanguageCode): TaskKeywords;
  getKeywordsByTask(language: ELanguageCode, taskType: ETask): Keyword[];
}

export const IKeywordRepositoryType = Symbol.for("IKeywordRepository");
