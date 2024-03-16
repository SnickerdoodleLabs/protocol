import { BaseStemmer } from "@nlpjs/core";
import { StemmerEn, StopwordsEn } from "@nlpjs/lang-en";
import { ELanguageCode, NLPError } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IStemmerService } from "@nlp/interfaces/index.js";
import { NLPSupportedLanguages } from "@nlp/objects/index.js";

@injectable()
export class StemmerService implements IStemmerService {
  public tokenizeSync(language: ELanguageCode, text: string): string[] {
    if (!NLPSupportedLanguages.includes(language)) {
      return text.split(" ");
    }
    try {
      return this.getStemmer(language).tokenizeAndStem(text, false); // does normalization by default and, false means "dont keep stopwords"
    } catch (error) {
      throw new NLPError((error as Error).message, error);
    }
  }

  public tokenize(
    language: ELanguageCode,
    text: string,
  ): ResultAsync<string[], NLPError> {
    try {
      return okAsync(this.tokenizeSync(language, text));
    } catch (error) {
      return errAsync(error as NLPError); // guranteed to be NLPError
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
