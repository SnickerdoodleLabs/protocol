import { IStemmerServiceType, IStemmerService } from "@snickerdoodlelabs/nlp";
import {
  DomainName,
  ELanguageCode,
  NLPError,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, ok, okAsync } from "neverthrow";

import { IPurchaseUtils } from "@shopping-data/interfaces/index.js";
import { PurchasedProduct } from "@shopping-data/objects/index.js";

@injectable()
export class PurchaseUtils implements IPurchaseUtils {
  constructor(
    @inject(IStemmerServiceType)
    private stemmerService: IStemmerService,
  ) {}

  public contains(
    purchases: PurchasedProduct[],
    purchase: PurchasedProduct,
  ): ResultAsync<boolean, never> {
    return this.filterByMPAndDate(
      purchases,
      purchase.marketPlace,
      purchase.datePurchased,
    ).andThen((filtered) => {
      return this.containsWithSimilarNameAndPrice(filtered, purchase);
    });
  }

  public containsWithSimilarNameAndPrice(
    purchasesWithSameMPAndDate: PurchasedProduct[],
    purchase: PurchasedProduct,
  ): ResultAsync<boolean, never> {
    // TODO, instead of bag-of-words, use word2vec model to do a similarity comparison on vectors. https://github.com/georgegach/w2v
    // TODO: talk to Charlie about bunlding nlp.js with the app https://github.com/axa-group/nlp.js/blob/master/docs/v4/webandreact.md

    throw new Error("Method not implemented.");
  }

  private filterByMPAndDate(
    purchases: PurchasedProduct[],
    marketPlace: DomainName,
    datePurchased: UnixTimestamp,
  ): ResultAsync<PurchasedProduct[], never> {
    const filtered = purchases.reduce((acc, curr) => {
      if (
        curr.marketPlace == marketPlace &&
        curr.datePurchased == datePurchased
      ) {
        acc.push(curr);
      }
      return acc;
    }, [] as PurchasedProduct[]);
    return okAsync(filtered);
  }

  public getProductHash(
    language: ELanguageCode,
    productName: string,
  ): ResultAsync<string, NLPError> {
    const result = this.getProductNameTokens(language, productName);
    return result.map((tokens) => this.getHashFromTokens(tokens));
  }

  private getHashFromTokens(tokens: string[]): string {
    return tokens.sort().slice(0, 10).join("-");
  }

  private getProductNameTokens(
    language: ELanguageCode,
    productName: string,
  ): ResultAsync<string[], NLPError> {
    return this.stemmerService.tokenize(language, productName);
  }
}
