import "reflect-metadata";

import { LogUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import { DomainName, ELanguageCode } from "@snickerdoodlelabs/objects";

import { LLMProductMetaUtilsChatGPT } from "@ai-scraper/implementations/";
import {
  MockLogUtils,
  chatGPTProductMetaResponse,
  chatGPTProductMetaResponseMissingCategory,
  chatGPTProductMetaResponseMissingProductId,
  chatGPTPurchaseHistoryResponse,
  chatGPTPurchaseHistoryResponseFirstMissingDate,
  chatGPTPurchaseHistoryResponseMissingPrice,
  emptyProductMetaResponse,
  emptyProductMetaResponseNonJSON,
  emptyPurchaseHistoryList,
  emptyPurchaseHistoryNonJSON,
  firstProductMeta,
  firstPurchase,
  secondProductMeta,
} from "@ai-scraper-test/mocks/index.js";

class Mocks {
  public timeUtils = new TimeUtils();
  public logUtils = new MockLogUtils();
  public factory() {
    return new LLMProductMetaUtilsChatGPT(this.timeUtils, this.logUtils);
  }
}

describe("LLMProductMetaUtilsChatGPT", () => {
  test("parse product meta", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parseMeta(
      DomainName("amazon.com"),
      ELanguageCode.English,
      chatGPTProductMetaResponse,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const metas = result._unsafeUnwrap();
    expect(metas.length).toBe(10);
    const gotFirst = metas[0];
    expect(gotFirst.productId).toBe(firstProductMeta.product_id.toString());
    expect(gotFirst.category).toBe(firstProductMeta.category);
    expect(gotFirst.keywords).toEqual(firstProductMeta.keywords);
  });
  test("parse product meta missing id", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parseMeta(
      DomainName("amazon.com"),
      ELanguageCode.English,
      chatGPTProductMetaResponseMissingProductId,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const metas = result._unsafeUnwrap();
    expect(metas.length).toBe(9);
    const gotFirst = metas[0];
    expect(gotFirst.productId).toBe(secondProductMeta.product_id.toString());
    expect(gotFirst.category).toBe(secondProductMeta.category);
    expect(gotFirst.keywords).toEqual(secondProductMeta.keywords);
  });

  test("parse product meta missing category", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parseMeta(
      DomainName("amazon.com"),
      ELanguageCode.English,
      chatGPTProductMetaResponseMissingCategory,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const metas = result._unsafeUnwrap();
    expect(metas.length).toBe(10);
    const gotFirst = metas[0];
    expect(gotFirst.productId).toBe(firstProductMeta.product_id.toString());
    expect(gotFirst.category).toBeNull();
    expect(gotFirst.keywords).toEqual(firstProductMeta.keywords);
  });

  test("parse product meta empty", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parseMeta(
      DomainName("amazon.com"),
      ELanguageCode.English,
      emptyProductMetaResponse,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const metas = result._unsafeUnwrap();
    expect(metas.length).toBe(0);
  });

  test("parse product meta non JSON", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parseMeta(
      DomainName("amazon.com"),
      ELanguageCode.English,
      emptyProductMetaResponseNonJSON,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const metas = result._unsafeUnwrap();
    expect(metas.length).toBe(0);
  });
});
