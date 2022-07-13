import {
  EncryptedString,
  InitializationVector,
  LanguageCode,
} from "@objects/primitives";

export interface ICrumbContent {
  [languageCode: LanguageCode]: {
    d: EncryptedString;
    iv: InitializationVector;
  };
}
