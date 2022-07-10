import {
  EVMAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface ILoginParams {
  accountAddress: EVMAccountAddress;
  signature: Signature;
  languageCode: LanguageCode;
}

export interface IAddAccountParams {
  accountAddress: EVMAccountAddress;
  signature: Signature;
  languageCode: LanguageCode;
}

export interface IGetLoginMessageParams {
  languageCode: LanguageCode;
}
