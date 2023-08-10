import { URLString } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow/dist";

import {
  DomainTask,
  IURLUtils,
  IURLUtilsType,
  IWebpageClassifier,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class WebpageClassifier implements IWebpageClassifier {
  public constructor(
    @inject(IURLUtilsType)
    private urlUtils: IURLUtils,
  ) {}
  public classify(url: URLString): ResultAsync<DomainTask, TypeError> {
    // Simplest version
    return this.urlUtils.getDomain(url).andThen((domain) => {
      return this.urlUtils.getTask(url).map((task) => {
        return new DomainTask(domain, task);
      });
    });
  }
}
