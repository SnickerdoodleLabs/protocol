import {
  IpfsCID,
  ELanguageCode,
  ETask,
  Keyword,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { TaskKeywords } from "@ai-scraper/interfaces/TaskKeywords.js";

export interface IKeywordRepository {
  updateFromIPFS(cid: IpfsCID): ResultAsync<void, Error>;
  getKeywords(language: ELanguageCode): TaskKeywords;
  getKeywordsByTask(language: ELanguageCode, taskType: ETask): Set<Keyword>;
}

export const IKeywordRepositoryType = Symbol.for("IKeywordRepository");
