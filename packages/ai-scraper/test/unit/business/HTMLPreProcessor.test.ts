import "reflect-metadata";

import { HTMLPreProcessor } from "@ai-scraper/implementations/utils/HTMLPreProcessor";
import { IHTMLPreProcessor } from "@ai-scraper/interfaces";
import {
  fullHtml,
  fullTextAmazonPaginationOnly,
  fullTextOnly,
  fullTextWithImages,
  html1,
  text1,
} from "@ai-scraper-test/mocks/testHTMLPreprocessorData";

class mocks {
  public factory(): IHTMLPreProcessor {
    return new HTMLPreProcessor();
  }
}
describe("HTMLPreProcessor", () => {
  test("htmlToText hello world", async () => {
    // Arrange
    const processor = new mocks().factory();
    // Act
    const result = await processor.htmlToText(html1, null);
    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(text1);
  });

  test("htmlToText full text without images", async () => {
    // Arrange
    const processor = new mocks().factory();
    // Act
    const result = await processor.htmlToText(fullHtml, null);
    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(fullTextOnly);
  });

  test("htmlToText full text with images", async () => {
    // Arrange
    const processor = new mocks().factory();
    // Act
    const result = await processor.htmlToTextWithImages(fullHtml);
    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(fullTextWithImages);
  });

  test("htmlToText amazon pagination", async () => {
    // Arrange
    const processor = new mocks().factory();
    const amazonPagination = {
      baseElements: { selectors: [".a-pagination"] },
    };
    // Act
    const result = await processor.htmlToText(fullHtml, amazonPagination);
    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(fullTextAmazonPaginationOnly);
  });
});
