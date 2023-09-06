import { BaseStemmer } from "@nlpjs/core";
import { StemmerEn, StopwordsEn } from "@nlpjs/lang-en";
import { ELanguageCode, NLPError } from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IStemmerService } from "@nlp/interfaces/index.js";
import { NLPSupportedLanguages } from "@nlp/objects/index.js";

export class StemmerService implements IStemmerService {
  public tokenize(
    language: ELanguageCode,
    text: string,
  ): ResultAsync<string[], NLPError> {
    if (!NLPSupportedLanguages.includes(language)) {
      return okAsync(text.split(" "));
    }
    try {
      return okAsync(this.getStemmer(language).tokenizeAndStem(text, false)); // does normalization by default and, false means "dont keep stopwords"
    } catch (error) {
      return errAsync(new NLPError((error as Error).message, error));
    }
  }

  /**
   *
   * @param language
   * @returns returns english stemmer by default
   */
  private getStemmer(language: ELanguageCode): BaseStemmer {
    switch (language) {
      case ELanguageCode.English:
        return this.getStemmerEn();
    }
    return this.getStemmerEn();
  }

  private getStemmerEn(): StemmerEn {
    const stemmer = new StemmerEn();
    stemmer.stopwords = new StopwordsEn();
    return stemmer;
  }
}
