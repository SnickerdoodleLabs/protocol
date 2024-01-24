import "reflect-metadata";

import { LLMResponse, Prompt } from "@snickerdoodlelabs/objects";

import { LLMPurchaseValidator } from "@ai-scraper/implementations/utils/LLMPurchaseValidator.js";
import {
  firstPurchase,
  halucinatedPurchase,
  nonHalucinatedPurchase,
  purchaseHistoryData,
  purchaseHistoryPromptWithNoPurchases,
} from "@ai-scraper-test/mocks";

async function malformedJSONTester(llmResponse, expected) {
  // Arrange
  const validator = new LLMPurchaseValidator();
  const llmResponseObj = LLMResponse(llmResponse);

  // Act
  const res = await validator.fixMalformedJSONArrayResponse(llmResponseObj);
  const got = res._unsafeUnwrap();

  // Assert
  expect(got).toEqual(expected);
}

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


// const llmResponses = [
//   "[]",
//   'The quick [brown [fox] jumps over the] lazy dog. It barked.',
//   '[\n    {\n  "product_id": 1,\n   "category": "Beauty & Health",\n  "keywords": []\n    },\n    {\n  "product_id": 2,\n   ,\n  "category": "Outdoors",\n  "keywords": ["A", "B"]\n    }, \n]',
//   'Bad bad[\n    {\n  "product_id": 1,\n   "category": "Beauty & Health",\n  "keywords": []\n    },\n    {\n  "product_id": 2,\n   ,\n  "category": "Outdoors",\n  "keywords": ["A", "B"]\n    }, \n] \n This is a explanation',
//   "I have not JSON",
//   '{a: "I have a doc"}'
// ]



describe("LLMPurchaseValidator: fixMalformedJSONArrayResponse", () => {
  test("valid empty array", async () => {
    await malformedJSONTester('[]', '[]');
  });

  test("nested brackets", async () => {
    // Arrange
    const validator = new LLMPurchaseValidator();
    const llmResponse = LLMResponse('The quick [brown [fox] jumps over the] lazy dog. It barked.');
    const expected = LLMResponse('[brown [fox] jumps over the]');

    // Test
    await malformedJSONTester(llmResponse, expected);
  });

  test("missing brackets", async () => {
    // Arrange
    const validator = new LLMPurchaseValidator();
    const llmResponse = LLMResponse('{a: "I have a doc"}, {a: "I have a doc"}, and I have bad JSON');
    const expected = LLMResponse('[{a: "I have a doc"}, {a: "I have a doc"}]');

    // Test
    await malformedJSONTester(llmResponse, expected);
  });

  test("array with extra characters", async () => {
    // Arrange
    const validator = new LLMPurchaseValidator();
    const llmResponse = LLMResponse('`[\n    {\n  "product_id": 1,\n   "category": "Beauty & Health",\n  "keywords": []\n    },\n    {\n  "product_id": 2,\n   ,\n  "category": "Outdoors",\n  "keywords": ["A", "B"]\n    }, \n] \n This is a explanation');
    const expected = LLMResponse('[\n    {\n  "product_id": 1,\n   "category": "Beauty & Health",\n  "keywords": []\n    },\n    {\n  "product_id": 2,\n   ,\n  "category": "Outdoors",\n  "keywords": ["A", "B"]\n    }, \n]');
    
    // Test
    await malformedJSONTester(llmResponse, expected);
  });
});

