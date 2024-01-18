import { Prompt, PurchasedProduct } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILLMPurchaseValidator {
  trimHalucinatedPurchases(
    prompt: Prompt,
    purchases: PurchasedProduct[],
  ): ResultAsync<PurchasedProduct[], never>;
}

export const ILLMPurchaseValidatorType = Symbol.for("ILLMPurchaseValidator");
