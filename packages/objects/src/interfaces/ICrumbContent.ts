import {
  EncryptedString,
  InitializationVector,
  LanguageCode,
} from "@objects/primitives/index.js";

export interface ICrumbContent {
  [languageCode: string]: {
    d: EncryptedString;
    iv: InitializationVector;
  };
}
