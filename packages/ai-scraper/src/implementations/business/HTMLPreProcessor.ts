import {
  ELanguageCode,
  HTMLString,
  ScraperError,
} from "@snickerdoodlelabs/objects";
import { compile, convert } from "html-to-text";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { IHTMLPreProcessor } from "@ai-scraper/interfaces/index.js";

type Converter = (html: string) => string;

@injectable()
export class HTMLPreProcessor implements IHTMLPreProcessor {
  private converter: Converter;
  private converterWithImages: Converter;
  private converterWithLinks: Converter;
  private headConverter: Converter;

  public constructor() {
    const options = {
      selectors: [
        { selector: "a", options: { ignoreHref: true } },
        { selector: "img", format: "skip" },
      ],
    };
    this.converter = compile(options);

    const optionsImages = {
      baseElements: { selectors: ["body"] },
      selectors: [{ selector: "a", options: { ignoreHref: true } }],
    };

    this.converterWithImages = compile(optionsImages);

    const optionsLinks = {
      baseElements: { selectors: ["body"] },
      selectors: [{ selector: "img", format: "skip" }],
    };
    this.converterWithLinks = compile(optionsLinks);

    const headOptions = {
      baseElements: { selectors: ["head"] },
    };
    this.headConverter = compile(headOptions);
  }

  public getLanguage(
    html: HTMLString,
  ): ResultAsync<ELanguageCode, ScraperError> {
    return okAsync(ELanguageCode.English); // TODO parse html tag for language. if not found, use third party library to detect language such as google translate.
  }

  public htmlToText(
    html: HTMLString,
    options: unknown | null,
  ): ResultAsync<string, ScraperError> {
    if (options == null) {
      return okAsync(this.converter(html));
    } else {
      return okAsync(convert(html, options));
    }
  }
  public htmlToTextWithImages(
    html: HTMLString,
  ): ResultAsync<string, ScraperError> {
    return okAsync(this.converterWithImages(html));
  }
  public htmlToTextWithLinks(
    html: HTMLString,
  ): ResultAsync<string, ScraperError> {
    return okAsync(this.converterWithLinks(html));
  }
}
