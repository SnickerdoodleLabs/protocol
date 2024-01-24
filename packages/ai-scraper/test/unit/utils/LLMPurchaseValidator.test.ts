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



describe("LLMPurchaseValidator: fixMalformedJSONArrayResponse", () => {
  test("all fake in an empty history", async () => {
    const llmResponses = [
      "[]",
      'The quick [brown [fox] jumps over the] lazy dog. It barked.',
      '[\n    {\n  "product_id": 1,\n   "category": "Beauty & Health",\n  "keywords": []\n    },\n    {\n  "product_id": 2,\n   ,\n  "category": "Outdoors",\n  "keywords": ["A", "B"]\n    }, \n]',
      'Bad bad[\n    {\n  "product_id": 1,\n   "category": "Beauty & Health",\n  "keywords": []\n    },\n    {\n  "product_id": 2,\n   ,\n  "category": "Outdoors",\n  "keywords": ["A", "B"]\n    }, \n] \n This is a explanation',
      "I have not JSON",
      '{a: "I have a doc"}'
    ]
    const arrayExpression = /\[.*\]/gs; // s to match newlines with .

    for (const llmResponse of llmResponses) {
      const arrayMatch = llmResponse.match(arrayExpression);
      expect(arrayMatch).toBeTruthy();
    }
  })});

