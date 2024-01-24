import "reflect-metadata";
import { MockLogUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import { DomainName, ELanguageCode } from "@snickerdoodlelabs/objects";

import { LLMPurchaseHistoryUtilsChatGPT } from "@ai-scraper/implementations";
import {
  chatGPTPurchaseHistoryResponse,
  chatGPTPurchaseHistoryResponseFirstMissingDate,
  chatGPTPurchaseHistoryResponseMissingPrice,
  emptyPurchaseHistoryList,
  emptyPurchaseHistoryNonJSON,
  firstPurchase,
} from "@ai-scraper-test/mocks/index.js";

class Mocks {
  public timeUtils = new TimeUtils();
  public logUtils = new MockLogUtils();
  public factory() {
    return new LLMPurchaseHistoryUtilsChatGPT(this.timeUtils, this.logUtils);
  }
}

describe("LLMPurchaseHistoryUtilsChatGPT", () => {
  test("Parse purchase history of twelve products with one have 0 price", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parsePurchases(
      DomainName("amazon.com"),
      ELanguageCode.English,
      chatGPTPurchaseHistoryResponse,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const purchases = result._unsafeUnwrap();
    expect(purchases.length).toBe(11); // one of the 12 has price 0

    const gotFirst = purchases[0];
    expect(gotFirst.name).toBe(firstPurchase.name);
    expect(gotFirst.brand).toBe(firstPurchase.brand);
    expect(gotFirst.price).toEqual(firstPurchase.price);
    expect(gotFirst.category).toBe(firstPurchase.classification);
    expect(gotFirst.keywords).toEqual(firstPurchase.keywords);
    expect(gotFirst.datePurchased).toBe(
      mocks.timeUtils.parseToSDTimestamp(firstPurchase.date),
    );
  });

  test("empty purchase history No JSON", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parsePurchases(
      DomainName("amazon.com"),
      ELanguageCode.English,
      emptyPurchaseHistoryNonJSON,
    );

    // Assert
    expect(result.isErr()).toBeTruthy();
  });

  test("empty purchase history", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parsePurchases(
      DomainName("amazon.com"),
      ELanguageCode.English,
      emptyPurchaseHistoryList,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();
    const purchases = result._unsafeUnwrap();
    expect(purchases.length).toBe(0);
  });
  test("Parse purchase history VANMASS missing date and Purrfectzone price 0", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parsePurchases(
      DomainName("amazon.com"),
      ELanguageCode.English,
      chatGPTPurchaseHistoryResponseFirstMissingDate,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const purchases = result._unsafeUnwrap();
    expect(purchases.length).toBe(10);

    const gotFirst = purchases[0];
    expect(gotFirst.name).not.toBe(firstPurchase.name);
  });

  test("Parse purchase history VANMASS missing price and Purrfectzone price 0", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parsePurchases(
      DomainName("amazon.com"),
      ELanguageCode.English,
      chatGPTPurchaseHistoryResponseMissingPrice,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const purchases = result._unsafeUnwrap();
    expect(purchases.length).toBe(10);
    const gotFirst = purchases[0];
    expect(gotFirst.name).not.toBe(firstPurchase.name);
  });
});
