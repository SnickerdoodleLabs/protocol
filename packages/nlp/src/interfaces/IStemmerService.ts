import { ELanguageCode } from "@snickerdoodlelabs/objects";

export interface IStemmerService {
  tokenize(languageCode: ELanguageCode, text: string): string[];
}

export const IStemmerServiceType = Symbol.for("IStemmerService");
