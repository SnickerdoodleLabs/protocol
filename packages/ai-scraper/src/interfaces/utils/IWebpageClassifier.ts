import {
  DomainTask,
  ELanguageCode,
  InvalidURLError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IWebpageClassifier {
  classify(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<DomainTask, InvalidURLError>;
}

export const IWebpageClassifierType = Symbol.for("IWebpageClassifier");
