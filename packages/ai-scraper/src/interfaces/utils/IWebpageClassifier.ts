import { URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow/dist";

import { DomainTask } from "@ai-scraper/interfaces/index.js";

export interface IWebpageClassifier {
  classify(url: URLString): ResultAsync<DomainTask, TypeError>;
}

export const IWebpageClassifierType = Symbol.for("IWebpageClassifier");
