import { Language, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { DomainTask } from "@ai-scraper/interfaces/index.js";

export interface IWebpageClassifier {
  classify(
    url: URLString,
    language: Language,
  ): ResultAsync<DomainTask, TypeError>;
}

export const IWebpageClassifierType = Symbol.for("IWebpageClassifier");
