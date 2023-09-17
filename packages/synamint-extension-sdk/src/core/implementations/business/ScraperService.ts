import {
  DiscordGuildProfile,
  DiscordID,
  DiscordProfile,
  DomainName,
  DomainTask,
  ELanguageCode,
  HTMLString,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  OAuthAuthorizationCode,
  ScraperError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IScraperService } from "@synamint-extension-sdk/core/interfaces/business/IScraperService";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";

@injectable()
export class ScraperService implements IScraperService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}
  scrape(
    url: URLString,
    html: HTMLString,
    suggestedDomainTask: DomainTask,
    sourceDomain?: DomainName,
  ): ResultAsync<void, ScraperError> {
    return this.core.scraper
      .scrape(url, html, suggestedDomainTask, sourceDomain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new ScraperError((error as Error).message, error);
      });
  }
  classifyURL(
    url: URLString,
    language: ELanguageCode,
    sourceDomain?: DomainName,
  ): ResultAsync<DomainTask, ScraperError> {
    return this.classifyURL(url, language, sourceDomain).mapErr((error) => {
      this.errorUtils.emit(error);
      return new ScraperError((error as Error).message, error);
    });
  }
  poll(): ResultAsync<void, ScraperError> {
    return this.poll().mapErr((error) => {
      this.errorUtils.emit(error);
      return new ScraperError((error as Error).message, error);
    });
  }
}