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
} from "@snickerdoodlelabs/objects";
import {
  ProductKeyword,
  PurchaseId,
  PurchasedProduct,
  ProductCategories,
  ProductMeta,
  ProductId,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import {
  IPurchaseBlock,
  ILLMProductMetaUtils,
  IProductMetaBlock,
} from "@ai-scraper/interfaces/index.js";

/**
 * @description We will make this updateable via ipfs in future. For now,
 * it will implement utils for all the tasks. Later we can break this into multiple classes
 */
@injectable()
export class LLMProductMetaUtilsChatGPT implements ILLMProductMetaUtils {
  public constructor(
    @inject(ITimeUtilsType)
    private timeUtils: ITimeUtils,
    @inject(ILogUtilsType)
    private logUtils: ILogUtils,
  ) {}
  public getRole(): LLMRole {
    return LLMRole(
      "You are an expert in understanding product categories and keywords.",
    );
  }

  public getQuestion(): LLMQuestion {
    // return LLMQuestion(
    //   "Can you get the product names from the following text? I also need the product brand, price, classification, keywords, and date purchased. Give response in a JSON array in the preceding format.",
    // );
    return LLMQuestion(
      `Classification denotes the category of the product and keywords describe the products using a few keywords. For categories choose from [${ProductCategories.join(
        ", ",
      )}] only. A product has one category and multiple keywords. Here is a list of products seperated by new lines.`,
    );
  }

  public getAnswerStructure(): LLMAnswerStructure {
    return LLMAnswerStructure(
      `I need to extract categories and keywords of some products. Sub-category is more specific.  I need all the output in this format:
      \n\nJSON format for each product: \n
          {
              product_id: number,
              sub_category: string,
              category: string,
              keywords: string[],
          }
          \n\nGive response in a JSON array in the preceding format. The array is enclosed in third brackets.`,
    );
  }

  public parseMeta(
    domain: DomainName,
    language: ELanguageCode,
    llmResponse: LLMResponse,
  ): ResultAsync<ProductMeta[], LLMError> {
    try {
      const metas: IProductMetaBlock[] = JSON.parse(llmResponse);
      // worst possible parser
      const productMetas = metas.map((meta) => {
        if (meta.product_id == null) {
          this.logUtils.debug(
            `Invalid product id ${meta.product_id} in ${meta}`,
          );
          return null;
        }

        return new ProductMeta(
          ProductId(meta.product_id.toString()),
          meta.category,
          (meta.keywords ?? []) as ProductKeyword[],
        );
      });
      const validMetas = productMetas.filter(
        (meta) => meta != null,
      ) as ProductMeta[];

      return okAsync(validMetas);
    } catch (e) {
      // return errAsync(new LLMError((e as Error).message, e));
      this.logUtils.warning(`No product meta. LLMRReponse: ${llmResponse}`);
      return okAsync([]); // TODO do something else
    }
  }
}
