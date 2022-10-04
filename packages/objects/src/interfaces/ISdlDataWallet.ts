import { EventEmitter } from "events";

import { ResultAsync } from "neverthrow";

import { IEVMNFT } from "@objects/businessObjects";
import { EChain } from "@objects/enum";
import { IEVMBalance } from "@objects/interfaces/IEVMBalance";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata";
import {
  Age,
  BigNumberString,
  CountryCode,
  EmailAddressString,
  EVMAccountAddress,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  IpfsCID,
  LanguageCode,
  Signature,
  UnixTimestamp,
  UUID,
} from "@objects/primitives";

export interface ISdlDataWallet extends EventEmitter {
  unlock(
    account: EVMAccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, unknown>;
  addAccount: (
    accountAddress: EVMAccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ) => ResultAsync<void, unknown>;
  getUnlockMessage: (
    languageCode?: LanguageCode,
  ) => ResultAsync<string, unknown>;
  setAge(age: Age): ResultAsync<void, unknown>;
  getAge(): ResultAsync<Age | null, unknown>;
  setGivenName(givenName: GivenName): ResultAsync<void, unknown>;
  getGivenName(): ResultAsync<GivenName | null, unknown>;
  setFamilyName(familyName: FamilyName): ResultAsync<void, unknown>;
  getFamilyName(): ResultAsync<FamilyName | null, unknown>;
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, unknown>;
  getBirthday(): ResultAsync<UnixTimestamp | null, unknown>;
  setGender(gender: Gender): ResultAsync<void, unknown>;
  getGender(): ResultAsync<Gender | null, unknown>;
  setEmail(email: EmailAddressString): ResultAsync<void, unknown>;
  getEmail(): ResultAsync<EmailAddressString | null, unknown>;
  setLocation(location: CountryCode): ResultAsync<void, unknown>;
  getLocation(): ResultAsync<CountryCode | null, unknown>;
  metatransactionSignatureRequestCallback(
    id: UUID,
    metatransactionSignature: Signature,
    nonce: BigNumberString,
  ): ResultAsync<void, unknown>;
  getAccounts(): ResultAsync<EVMAccountAddress[], unknown>;
  getAccountBalances(): ResultAsync<IEVMBalance[], unknown>;
  getAccountNFTs(): ResultAsync<IEVMNFT[], unknown>;
  closeTab(): ResultAsync<void, unknown>;
  getDataWalletAddress(): ResultAsync<EVMAccountAddress | null, unknown>;
  getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    unknown
  >;
  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, unknown>;
  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, unknown>;
}
