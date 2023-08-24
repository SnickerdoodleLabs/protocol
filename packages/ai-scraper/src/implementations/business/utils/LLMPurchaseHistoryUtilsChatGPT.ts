import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  ProductKeyword,
  PurchasedProduct,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";

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
    return LLMRole("You are an expert in understanding e-commerce");
  }

  public getQuestion(): LLMQuestion {
    return LLMQuestion(
      "Can you get the product names from the following text? I also need the product brand, price, classification, keywords, and date purchased.",
    );
  }

  public getAnswerStructure(): LLMAnswerStructure {
    return LLMAnswerStructure(
      "Respond with the names, brand, price, classification, keywords, and date only. Please, use JSON structure for output",
    );
  }

  public parsePurchases(llmResponse: LLMResponse): PurchasedProduct {
    const jsonObj = JSON.parse(llmResponse);
    // worst possible parser
    const purchases: IPurchaseBlock[] = jsonObj["purchases"];
    const purchasedProducts = purchases.map((purchase) => {
      new PurchasedProduct(
        null,
        purchase["name"],
        purchase["brand"],
        purchase["price"],
        purchase["date_purchased"],
        this.timeUtils.now(),
        null,
        null,
        null,
        purchase["classification"],
        purchase["keywords"] as ProductKeyword[],
      );
    });
  }
}
