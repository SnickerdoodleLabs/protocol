import {
  EthereumAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

export class LoginParams {
  constructor(
    public accountAddress: EthereumAccountAddress,
    public signature: Signature,
    public languageCode: LanguageCode,
  ) {}
}

export class AddAccountParams {
  constructor(
    public accountAddress: EthereumAccountAddress,
    public signature: Signature,
    public languageCode: LanguageCode,
  ) {}
}

export class GetLoginMessageParams {
  constructor(public languageCode: LanguageCode) {}
}
