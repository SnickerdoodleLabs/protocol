import {
  EthereumAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface ILoginParams {
  accountAddress: EthereumAccountAddress;
  signature: Signature;
  languageCode: LanguageCode;
}

export interface IAddAccountParams {
  accountAddress: EthereumAccountAddress;
  signature: Signature;
  languageCode: LanguageCode;
}

export interface IGetLoginMessageParams {
  languageCode: LanguageCode;
}
