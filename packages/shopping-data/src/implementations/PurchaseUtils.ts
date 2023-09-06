import { BaseStemmer } from "@nlpjs/core";
import { TokenizerEn, StopwordsEn, StemmerEn } from "@nlpjs/lang-en";
import {
  DomainName,
  ELanguageCode,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, ok, okAsync } from "neverthrow";

import { IPurchaseUtils } from "@shopping-data/interfaces/index.js";
import {
  PurchasedProduct,
  SupportedLanguages,
} from "@shopping-data/objects/index.js";

export class PurchaseUtils implements IPurchaseUtils {
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

  private getProductNameTokens(
    language: ELanguageCode,
    productName: string,
  ): string[] {
    if (!SupportedLanguages.includes(language)) {
      return productName.split(" ");
    }
    // const tokenizer = new TokenizerEn();
    const stemmer = new StemmerEn();
    // const stopWords = new StopwordsEn();
    // const tokens = tokenizer.tokenize(productName, true);
    return stemmer.tokenizeAndStem(productName, false); // does normalization by default and, false means "dont keep stopwords"
  }

  /**
   *
   * @param language
   * @returns returns english stemmer by default
   */
  private getStemmer(language: ELanguageCode): BaseStemmer {
    switch (language) {
      case ELanguageCode.English:
        return new StemmerEn();
    }
    return new StemmerEn();
  }
}
