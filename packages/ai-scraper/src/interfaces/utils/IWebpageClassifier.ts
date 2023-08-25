import { ELanguageCode, URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { DomainTask } from "@ai-scraper/interfaces/index.js";

export interface IWebpageClassifier {
  classify(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<DomainTask, TypeError>;
}

export const IWebpageClassifierType = Symbol.for("IWebpageClassifier");
