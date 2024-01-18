import "reflect-metadata";

import { Prompt } from "@snickerdoodlelabs/objects";

import { LLMPurchaseValidator } from "@ai-scraper/implementations/utils/LLMPurchaseValidator.js";
import {
  firstPurchase,
  halucinatedPurchase,
  nonHalucinatedPurchase,
  purchaseHistoryData,
  purchaseHistoryPromptWithNoPurchases,
} from "@ai-scraper-test/mocks";

describe("LLMPurchaseValidator: trimHalucinatedPurchases", () => {
  test("all fake in an empty history", async () => {
    // Arrange
    const validator = new LLMPurchaseValidator();
    const halucinatedPurchases = [nonHalucinatedPurchase, halucinatedPurchase];
    // Act
    const validPurchases = await validator.trimHalucinatedPurchases(
      purchaseHistoryPromptWithNoPurchases,
      halucinatedPurchases,
    );

    // Assert

    expect(validPurchases.isOk()).toBeTruthy();
    expect(validPurchases._unsafeUnwrap()).toEqual([]);
  });
  test("one fake in two purchases", async () => {
    // Arrange
    const validator = new LLMPurchaseValidator();
    const halucinatedPurchases = [nonHalucinatedPurchase, halucinatedPurchase];
    // Act
    const validPurchases = await validator.trimHalucinatedPurchases(
      Prompt(purchaseHistoryData as string),
      halucinatedPurchases,
    );

    // Assert

    expect(validPurchases.isOk()).toBeTruthy();
    const got = validPurchases._unsafeUnwrap();
    expect(got.length).toBe(1);
    expect(got[0].name).toEqual(nonHalucinatedPurchase.name);
  });
});
