import {
  DomainTask,
  ELanguageCode,
  InvalidURLError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import {
  IKeywordRepository,
  IKeywordRepositoryType,
  IURLUtils,
  IURLUtilsType,
  IWebpageClassifier,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class WebpageClassifier implements IWebpageClassifier {
  public constructor(
    @inject(IURLUtilsType)
    private urlUtils: IURLUtils,
    @inject(IKeywordRepositoryType)
    private keywordRepository: IKeywordRepository,
  ) {}
  public classify(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<DomainTask, InvalidURLError> {
    // Simplest version
    console.log("WebpageClassifier:classify");
    return this.urlUtils.getDomain(url).andThen((domain) => {
      console.log("WebpageClassifier:domain", domain);
      return this.urlUtils.getTask(url, language).andThen((task) => {
        console.log("WebpageClassifier:task", task);
        return okAsync(new DomainTask(domain, task));
      });
    });
  }
}
