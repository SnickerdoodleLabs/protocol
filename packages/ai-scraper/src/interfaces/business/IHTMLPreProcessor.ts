import { ScraperError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHTMLPreProcessor {
  htmlToText(
    html: string,
    options: unknown | null,
  ): ResultAsync<string, ScraperError>;

  htmlToTextWithImages(html: string): ResultAsync<string, ScraperError>;
  htmlToTextWithLinks(html: string): ResultAsync<string, ScraperError>;
}

export const IHTMLPreProcessorType = Symbol.for("IHTMLPreProcessor");
