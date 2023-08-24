import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { LLMError, ScraperError } from "@snickerdoodlelabs/objects";
import {
  ProductKeyword,
  PurchasedProduct,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { IPurchaseBlock } from "../../../interfaces/IPurchaseBlock";

import {
  Exemplar,
  ILLMPurchaseHistoryUtils,
  LLMAnswerStructure,
  LLMQuestion,
  LLMResponse,
  LLMRole,
} from "@ai-scraper/interfaces/index.js";

/**
 * @description We will make this updateable via ipfs in future. For now,
 * it will implement utils for all the tasks. Later we can break this into multiple classes
 */
@injectable()
export class LLMPurchaseHistoryUtilsChatGPT
  implements ILLMPurchaseHistoryUtils
{
  public constructor(@inject(ITimeUtilsType) private timeUtils: ITimeUtils) {}
  public getRole(): LLMRole {
    return LLMRole("You are an expert in understanding e-commerce.");
  }

  public getQuestion(): LLMQuestion {
    return LLMQuestion(
      "Can you get the product names from the following text? I also need the product brand, price, classification, keywords, and date purchased. Give response in a JSON array in the preceding format.",
    );
  }

  public getAnswerStructure(): LLMAnswerStructure {
    return LLMAnswerStructure(
      `I need all the output in this format:
      \n\nJSON format: \n
          {
              name: string,
              brand: string,
              price: number,
              classification: string,
              keywords: string[],
              date: string
          }`,
    );
  }

  public parsePurchases(
    llmResponse: LLMResponse,
  ): ResultAsync<PurchasedProduct[], LLMError> {
    const purchases: IPurchaseBlock[] = JSON.parse(llmResponse);
    // worst possible parser
    const purchasedProducts = purchases.map((purchase) => {
      return new PurchasedProduct(
        null,
        purchase["name"],
        purchase["brand"],
        this.extractPrice(purchase["price"]),
        this.timeUtils.parseToSDTimestamp(purchase["date_purchased"]),
        this.timeUtils.getUnixNow(),
        null,
        null,
        null,
        purchase["classification"],
        purchase["keywords"] as ProductKeyword[],
      );
    });

    return okAsync(purchasedProducts);
  }

  public extractPrice(priceStr: string): number {
    try {
      return parseFloat(priceStr.replace("$", ""));
    } catch (e) {
      return 0;
    }
  }
}
