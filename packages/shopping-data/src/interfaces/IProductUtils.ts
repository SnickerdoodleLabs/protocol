import { ELanguageCode, NLPError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IProductUtils {
  /**
   *
   * @param language
   * @param productName
   * @returns a hash containing first 10 non stop words stemmed and sorted alphabetically and glued together with a hypen
   */
  getProductHash(
    language: ELanguageCode,
    productName: string,
  ): ResultAsync<string, NLPError>;

  /**
   *
   * @param language
   * @param productName
   * @returns a hash containing first 10 non stop words stemmed and sorted alphabetically and glued together with a hypen
   * @throws NLPError
   */
  getProductHashSync(language: ELanguageCode, productName: string): string;
}

export const IProductUtilsType = Symbol.for("IProductUtils");