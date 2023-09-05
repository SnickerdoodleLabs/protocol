import {
  ELanguageCode,
  HTMLString,
  ScraperError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHTMLPreProcessor {
  getLanguage(html: HTMLString): ResultAsync<ELanguageCode, ScraperError>;
  htmlToText(
    html: HTMLString,
    options: unknown | null,
  ): ResultAsync<string, ScraperError>;

  htmlToTextWithImages(html: HTMLString): ResultAsync<string, ScraperError>;
  htmlToTextWithLinks(html: HTMLString): ResultAsync<string, ScraperError>;
}

export const IHTMLPreProcessorType = Symbol.for("IHTMLPreProcessor");
