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
  PageNo,
  ScraperError,
  URLString,
  Year,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IScraperNavigationService } from "@synamint-extension-sdk/core/interfaces/business/IScraperNavigationService";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";

@injectable()
export class ScraperNavigationService implements IScraperNavigationService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}
  getOrderHistoryPage(lang: ELanguageCode, page: PageNo): URLString {
    return this.core.scraperNavigation.amazon.getOrderHistoryPage(lang, page);
  }
  getYears(html: HTMLString): Year[] {
    return this.core.scraperNavigation.amazon.getYears(html);
  }
  getOrderHistoryPageByYear(
    lang: ELanguageCode,
    year: Year,
    page: PageNo,
  ): URLString {
    return this.core.scraperNavigation.amazon.getOrderHistoryPageByYear(
      lang,
      year,
      page,
    );
  }
  getPageCount(html: HTMLString, year: Year): number {
    return this.core.scraperNavigation.amazon.getPageCount(html, year);
  }
}
