import { ScraperError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHTMLPreProcessor {
  htmlToText(html: string): ResultAsync<string, ScraperError>;
}

export const IHTMLPreProcessorType = Symbol.for("IHTMLPreProcessor");
