import { TokenizerEn, StopwordsEn, StemmerEn } from "@nlpjs/lang-en";
import { ELanguageCode, NLPError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IStemmerService {
  tokenize(
    language: ELanguageCode,
    text: string,
  ): ResultAsync<string[], NLPError>;

  /**
   * This version throws NLPError. Needed for optimization
   * @param language
   * @param text
   * @returns tokens
   * @throws NLPError
   */
  tokenizeSync(language: ELanguageCode, text: string): string[];
}

export const IStemmerServiceType = Symbol.for("IStemmerService");
