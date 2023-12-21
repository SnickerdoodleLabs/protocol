import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  DomainName,
  ELanguageCode,
  LLMAnswerStructure,
  LLMError,
  LLMQuestion,
  LLMResponse,
  LLMRole,
  UnixTimestamp,
  ProductKeyword,
  PurchaseId,
  PurchasedProduct,
  UnknownProductCategory,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IPurchaseBlock,
  ILLMPurchaseHistoryUtils,
} from "@ai-scraper/interfaces/index.js";

/**
 * @description We will make this updateable via ipfs in future. For now,
 * it will implement utils for all the tasks. Later we can break this into multiple classes
 */
@injectable()
export class LLMPurchaseHistoryUtilsChatGPT
  implements ILLMPurchaseHistoryUtils
{
  public constructor(
    @inject(ITimeUtilsType)
    private timeUtils: ITimeUtils,
    @inject(ILogUtilsType)
    private logUtils: ILogUtils,
  ) {}
  public getRole(): LLMRole {
    return LLMRole("You are an expert in understanding e-commerce.");
  }

  public getQuestion(): LLMQuestion {
    // return LLMQuestion(
    //   "Can you get the product names from the following text? I also need the product brand, price, classification, keywords, and date purchased. Give response in a JSON array in the preceding format.",
    // );
    return LLMQuestion(
      `I need the purchase history from the following content. You need to follow theses rules:
      A purchase history must have a product name, price, and date of purchase. It can also have brand, classification, keywords which are optional. 
      Classification denotes the category of the product and keywords describe the products using a few key words. 
      The purchase date and price cannot be null. 
      Do not include a purchase information in the output if the purchase date or price is missing. 
      Do not push yourself hard and do not generate imaginary purchases.
      Give response in a JSON array in the preceding format.`,
    );
  }

  public makePurchaseId(
    purchase: IPurchaseBlock,
    timestampPurchased: UnixTimestamp,
  ): PurchaseId {
    return PurchaseId(
      `${purchase.name}-${timestampPurchased}`.replace(" ", "-"),
    );
  }

  public getAnswerStructure(): LLMAnswerStructure {
    return LLMAnswerStructure(
      `I need to extract purchase information. I need all the output in this format:
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
    domain: DomainName,
    language: ELanguageCode,
    llmResponse: LLMResponse,
  ): ResultAsync<PurchasedProduct[], LLMError> {
    let purchases: IPurchaseBlock[] = [];
    try {
      purchases = JSON.parse(llmResponse);
    } catch (e) {
      // return errAsync(new LLMError((e as Error).message, e));
      // this.logUtils.warning(`No product history. LLMRReponse: ${llmResponse}`);
      return errAsync(
        new LLMError(`No product history. LLMRReponse: ${llmResponse}`, e),
      );
    }
    // worst possible parser
    const purchasedProducts = purchases.reduce((accumulator, purchase) => {
      const timestampPurchased = this.timeUtils.parseToSDTimestamp(
        purchase.date,
      );

      if (timestampPurchased == null) {
        this.logUtils.debug(
          `Invalid purchase date ${purchase.date} for ${purchase.name}`,
        );
      } else {
        const category = purchase.classification ?? UnknownProductCategory;
        accumulator.push(
          new PurchasedProduct(
            domain,
            language,
            this.makePurchaseId(purchase, timestampPurchased),
            purchase.name,
            purchase.brand,
            this.parsePrice(purchase.price),
            timestampPurchased,
            this.timeUtils.getUnixNow(),
            null,
            null,
            null,
            category,
            purchase.keywords as ProductKeyword[],
          ),
        );
      }
      return accumulator;
    }, [] as PurchasedProduct[]);

    return okAsync(purchasedProducts);
  }

  public parsePrice(priceStr: string | number): number {
    if (typeof priceStr === "number") {
      return priceStr;
    }
    try {
      return parseFloat(priceStr.replace("$", "")); // TODO make a regex to extract the decimal number instead of this.
    } catch (e) {
      return 0;
    }
  }
}
