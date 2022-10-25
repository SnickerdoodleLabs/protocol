import {
  Age,
  BigNumberString,
  CountryCode,
  DomainName,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
  UUID,
  EVMContractAddress,
  URLString,
  IpfsCID,
  EChain,
  EWalletDataType,
  AccountAddress,
} from "@snickerdoodlelabs/objects";

export interface IUnlockParams {
  accountAddress: AccountAddress;
  signature: Signature;
  chain: EChain;
  languageCode: LanguageCode;
}

export interface IAddAccountParams {
  accountAddress: AccountAddress;
  signature: Signature;
  chain: EChain;
  languageCode: LanguageCode;
}

export interface IUnlinkAccountParams {
  accountAddress: AccountAddress;
  signature: Signature;
  chain: EChain;
  languageCode: LanguageCode;
}

export interface IGetUnlockMessageParams {
  languageCode: LanguageCode;
}

export interface ISetAgeParams {
  age: Age;
}
export interface ISetGivenNameParams {
  givenName: GivenName;
}

export interface ISetFamilyNameParams {
  familyName: FamilyName;
}

export interface ISetBirthdayParams {
  birthday: UnixTimestamp;
}

export interface ISetGenderParams {
  gender: Gender;
}

export interface ISetEmailParams {
  email: EmailAddressString;
}

export interface ISetLocationParams {
  location: CountryCode;
}

export interface ISetApplyDefaultPermissionsParams {
  option: boolean;
}
export interface IGetInvitationWithDomainParams {
  domain: DomainName;
  path: string;
}
export interface IAcceptInvitationByUUIDParams {
  dataTypes: EWalletDataType[];
  id: UUID;
}
export interface IAcceptInvitationParams {
  dataTypes: EWalletDataType[];
  consentContractAddress: EVMContractAddress;
  tokenId?: BigNumberString;
  businessSignature?: Signature;
}

export interface IGetAgreementPermissionsParams {
  consentContractAddress: EVMContractAddress;
}

export interface ISetDefaultPermissionsWithDataTypesParams {
  dataTypes: EWalletDataType[];
}
export interface IRejectInvitationParams {
  id: UUID;
}

export interface ILeaveCohortParams {
  consentContractAddress: EVMContractAddress;
}

export interface IGetInvitationMetadataByCIDParams {
  ipfsCID: IpfsCID;
}

export interface IInvitationDomainWithUUID {
  domain: DomainName;
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
  id: UUID;
}
export interface ICheckURLParams {
  domain: DomainName;
}

export interface IGetConsentContractCIDParams {
  consentAddress: EVMContractAddress;
}

export interface ICheckInvitationStatusParams {
  consentAddress: EVMContractAddress;
  signature?: Signature | undefined;
  tokenId?: BigNumberString | undefined;
}
