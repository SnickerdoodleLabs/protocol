import {
  EncryptedString,
  InitializationVector,
  LanguageCode,
} from "@objects/primitives";

export interface ICrumbContent {
  [languageCode: string]: {
    d: EncryptedString;
    iv: InitializationVector;
  };
}
