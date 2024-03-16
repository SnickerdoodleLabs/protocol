import { LLMResponse, PurchasedProduct } from "@snickerdoodlelabs/objects";
import { ResultAsync, okAsync } from "neverthrow";

import { ILLMPurchaseValidator } from "@ai-scraper/interfaces/utils/ILLMPurchaseValidator.js";

import { injectable } from "inversify";
@injectable()
export class LLMPurchaseValidator implements ILLMPurchaseValidator {
  public trimHalucinatedPurchases(
    promptText: string,
    purchases: PurchasedProduct[],
  ): ResultAsync<PurchasedProduct[], never> {
    const validPurchases = purchases.reduce((acc, purchase) => {
      // we cannot add price here as multiple order pricing can be hacked a bit
      if (promptText.includes(purchase.name)) {
        return [...acc, purchase];
      }
      return acc;
    }, [] as PurchasedProduct[]);

    return okAsync(validPurchases);
  }

  
  fixMalformedJSONArrayResponse(
    llmResponse: LLMResponse
  ): ResultAsync<LLMResponse, never> {
    
    // There can be two issues
    // 1. The reponse has a valid JSON, but with extra text or characters around the array
    // 2. LLM can forget to add the array brackets around the response

    // First, we try to find the maximal array in the response
    const arrayExpression = /\[.*\]/gs; // s to match newlines with .
    const objectExpression = /\{.*\}/gs; // s to match newlines with .
    const arrayMatch = llmResponse.match(arrayExpression);
    if (arrayMatch) {
      const array = arrayMatch[0];
      return okAsync(LLMResponse(array));
    } else {
      // IF we fail, we try to wrap the response in array brackets
      // we match indibidual objects in the response and wrap them in array brackets
      const objectMatch = llmResponse.match(objectExpression);
      if (objectMatch) {
        const object = objectMatch[0];
        return okAsync(LLMResponse(`[${object}]`));
      }
    }

    return okAsync(LLMResponse("[]"));
  }

}
