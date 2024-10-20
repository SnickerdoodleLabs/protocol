import { ELanguageCode, URLString } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import {
  DomainTask,
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
  ): ResultAsync<DomainTask, TypeError> {
    // Simplest version
    return this.urlUtils.getDomain(url).andThen((domain) => {
      return this.urlUtils.getTask(url, language).andThen((task) => {
        return okAsync(new DomainTask(domain, task));
      });
    });
  }
}
