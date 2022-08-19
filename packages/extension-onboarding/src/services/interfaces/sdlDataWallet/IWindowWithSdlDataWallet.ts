import { EventEmitter } from "events";

import {
  Age,
  CountryCode,
  EmailAddressString,
  EVMAccountAddress,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  UnixTimestamp,
  Signature,
  UUID,
  BigNumberString,
  IEVMBalance,
  IEVMNFT,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISdlDataWallet extends EventEmitter {
  unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode?: LanguageCode,
  ): ResultAsync<void, unknown>;
  addAccount: (
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode?: LanguageCode,
  ) => ResultAsync<void, unknown>;
  getUnlockMessage: (
    languageCode?: LanguageCode,
  ) => ResultAsync<string, unknown>;
  setAge(age: Age): ResultAsync<void, unknown>;
  getAge(): ResultAsync<Age, unknown>;
  setGivenName(givenName: GivenName): ResultAsync<void, unknown>;
  getGivenName(): ResultAsync<GivenName, unknown>;
  setFamilyName(familyName: FamilyName): ResultAsync<void, unknown>;
  getFamilyName(): ResultAsync<FamilyName, unknown>;
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, unknown>;
  getBirthday(): ResultAsync<UnixTimestamp, unknown>;
  setGender(gender: Gender): ResultAsync<void, unknown>;
  getGender(): ResultAsync<Gender, unknown>;
  setEmail(email: EmailAddressString): ResultAsync<void, unknown>;
  getEmail(): ResultAsync<EmailAddressString, unknown>;
  setLocation(location: CountryCode): ResultAsync<void, unknown>;
  getLocation(): ResultAsync<CountryCode, unknown>;
  metatransactionSignatureRequestCallback(
    id: UUID,
    metatransactionSignature: Signature,
    nonce: BigNumberString,
  ): ResultAsync<void, unknown>;
  getAccounts(): ResultAsync<EVMAccountAddress[], unknown>;
  getAccountBalances(): ResultAsync<IEVMBalance[], unknown>;
  getAccountNFTs(): ResultAsync<IEVMNFT[], unknown>;
  closeTab(): ResultAsync<void, unknown>;
  getDataWalletAddress(): ResultAsync<EVMAccountAddress | null, undefined>;
}

export interface IWindowWithSdlDataWallet extends Window {
  sdlDataWallet: ISdlDataWallet;
}
