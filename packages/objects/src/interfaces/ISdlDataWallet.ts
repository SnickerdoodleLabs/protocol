import { EventEmitter } from "events";

import { IEVMNFT, LinkedAccount } from "@objects/businessObjects";
import { EChain, EWalletDataType } from "@objects/enum";
import { IEVMBalance } from "@objects/interfaces/IEVMBalance";
import { IOpenSeaMetadata } from "@objects/interfaces/IOpenSeaMetadata";
import {
  AccountAddress,
  Age,
  CountryCode,
  DataWalletAddress,
  EmailAddressString,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  IpfsCID,
  LanguageCode,
  Signature,
  UnixTimestamp,
} from "@objects/primitives";
import { ResultAsync } from "neverthrow";

type JsonRpcError = unknown;
export interface ISdlDataWallet extends EventEmitter {
  unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, JsonRpcError>;
  addAccount: (
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ) => ResultAsync<void, JsonRpcError>;
  getUnlockMessage: (
    languageCode?: LanguageCode,
  ) => ResultAsync<string, JsonRpcError>;
  setAge(age: Age): ResultAsync<void, JsonRpcError>;
  getAge(): ResultAsync<Age | null, JsonRpcError>;
  setGivenName(givenName: GivenName): ResultAsync<void, JsonRpcError>;
  getGivenName(): ResultAsync<GivenName | null, JsonRpcError>;
  setFamilyName(familyName: FamilyName): ResultAsync<void, JsonRpcError>;
  getFamilyName(): ResultAsync<FamilyName | null, JsonRpcError>;
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, JsonRpcError>;
  getBirthday(): ResultAsync<UnixTimestamp | null, JsonRpcError>;
  setGender(gender: Gender): ResultAsync<void, JsonRpcError>;
  getGender(): ResultAsync<Gender | null, JsonRpcError>;
  setEmail(email: EmailAddressString): ResultAsync<void, JsonRpcError>;
  getEmail(): ResultAsync<EmailAddressString | null, JsonRpcError>;
  setLocation(location: CountryCode): ResultAsync<void, JsonRpcError>;
  getLocation(): ResultAsync<CountryCode | null, JsonRpcError>;
  getAccounts(): ResultAsync<LinkedAccount[], JsonRpcError>;
  getAccountBalances(): ResultAsync<IEVMBalance[], JsonRpcError>;
  getAccountNFTs(): ResultAsync<IEVMNFT[], JsonRpcError>;
  closeTab(): ResultAsync<void, JsonRpcError>;
  getDataWalletAddress(): ResultAsync<DataWalletAddress | null, JsonRpcError>;
  getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  >;
  getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  >;
  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, JsonRpcError>;
  getAgreementPermissions(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], JsonRpcError>;
  getApplyDefaultPermissionsOption(): ResultAsync<boolean, JsonRpcError>;
  setApplyDefaultPermissionsOption(
    option: boolean,
  ): ResultAsync<boolean, JsonRpcError>;
  getDefaultPermissions(): ResultAsync<EWalletDataType[], JsonRpcError>;
  setDefaultPermissions(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, JsonRpcError>;
  setDefaultPermissionsToAll(): ResultAsync<void, JsonRpcError>;
  acceptPublicInvitationByConsentContractAddress(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, JsonRpcError>;
  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, JsonRpcError>;
  unlinkAcccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, JsonRpcError>;
}
