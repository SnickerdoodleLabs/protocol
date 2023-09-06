import { IStemmerServiceType, IStemmerService } from "@snickerdoodlelabs/nlp";
import { ELanguageCode, NLPError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IProductUtils } from "@shopping-data/interfaces/IProductUtils";

@injectable()
export class ProductUtils implements IProductUtils {
  constructor(
    @inject(IStemmerServiceType)
    private stemmerService: IStemmerService,
  ) {}

  public getProductHashSync(
    language: ELanguageCode,
    productName: string,
  ): string {
    const tokens = this.stemmerService.tokenizeSync(language, productName);
    return this.getHashFromTokens(tokens);
  }

  public getProductHash(
    language: ELanguageCode,
    productName: string,
  ): ResultAsync<string, NLPError> {
    const result = this.getProductNameTokens(language, productName);
    return result.map((tokens) => this.getHashFromTokens(tokens));
  }

  private getProductNameTokens(
    language: ELanguageCode,
    productName: string,
  ): ResultAsync<string[], NLPError> {
    return this.stemmerService.tokenize(language, productName);
  }

  private getHashFromTokens(tokens: string[]): string {
    return tokens.sort().slice(0, 10).join("-");
  }
}
