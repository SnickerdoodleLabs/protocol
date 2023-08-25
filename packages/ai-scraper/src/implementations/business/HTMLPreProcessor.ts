import { ScraperError } from "@snickerdoodlelabs/objects";
import { compile } from "html-to-text";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { IHTMLPreProcessor } from "@ai-scraper/interfaces/index.js";

type Converter = (html: string) => string;

@injectable()
export class HTMLPreProcessor implements IHTMLPreProcessor {
  private converter: Converter;

  public constructor() {
    const options = {
      selectors: [
        { selector: "a", options: { ignoreHref: true } },
        { selector: "img", format: "skip" },
      ],
    };
    this.converter = compile(options);
  }
  public htmlToText(html: string): ResultAsync<string, ScraperError> {
    return okAsync(this.converter(html));
  }
}
