import { TokenizerEn, StopwordsEn, StemmerEn } from "@nlpjs/lang-en";
import { ELanguageCode, NLPError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IStemmerService {
  tokenize(
    language: ELanguageCode,
    text: string,
  ): ResultAsync<string[], NLPError>;
}

export const IStemmerServiceType = Symbol.for("IStemmerService");
