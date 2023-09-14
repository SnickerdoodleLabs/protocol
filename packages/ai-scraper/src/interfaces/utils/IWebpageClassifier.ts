import {
  DomainTask,
  ELanguageCode,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IWebpageClassifier {
  classify(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<DomainTask, TypeError>;
}

export const IWebpageClassifierType = Symbol.for("IWebpageClassifier");
