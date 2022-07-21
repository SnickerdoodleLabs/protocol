import {
    EVMAccountAddress,
    LanguageCode,
    Signature,
  } from "@snickerdoodlelabs/objects";
  
  export interface IUnlockParams {
    accountAddress: EVMAccountAddress;
    signature: Signature;
    languageCode: LanguageCode;
  }
  
  export interface IAddAccountParams {
    accountAddress: EVMAccountAddress;
    signature: Signature;
    languageCode: LanguageCode;
  }
  
  export interface IGetUnlockMessageParams {
    languageCode: LanguageCode;
  }
  