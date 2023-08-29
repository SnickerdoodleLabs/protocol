import "reflect-metadata";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { DomainName } from "@snickerdoodlelabs/objects";

import { LLMPurchaseHistoryUtilsChatGPT } from "@ai-scraper/implementations";
import {
  chatGPTPurchaseHistoryResponse,
  firstPurchase,
} from "@ai-scraper-test/mocks";

class Mocks {
  public timeUtils = new TimeUtils();
  public factory() {
    return new LLMPurchaseHistoryUtilsChatGPT(this.timeUtils);
  }
}

describe("LLMPurchaseHistoryUtilsChatGPT", () => {
  test("Parse purchase history", async () => {
    // Arrange
    const mocks = new Mocks();
    const utils = mocks.factory();

    // Act
    const result = await utils.parsePurchases(
      DomainName("amazon.com"),
      chatGPTPurchaseHistoryResponse,
    );

    // Assert
    expect(result.isOk()).toBeTruthy();

    const purchases = result._unsafeUnwrap();
    expect(purchases.length).toBe(12);

    const gotFirst = purchases[0];
    expect(gotFirst.name).toBe(firstPurchase.name);
    expect(gotFirst.brand).toBe(firstPurchase.brand);
    expect(gotFirst.price).toBe(firstPurchase.price);
    expect(gotFirst.category).toBe(firstPurchase.classification);
    expect(gotFirst.keywords).toEqual(firstPurchase.keywords);
    expect(gotFirst.datePurchased).toBe(
      mocks.timeUtils.parseToSDTimestamp(firstPurchase.date),
    );
  });
});
