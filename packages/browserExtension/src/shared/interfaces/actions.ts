import {
  Age,
  BigNumberString,
  DataPermissions,
  CountryCode,
  DomainName,
  EmailAddressString,
  EVMAccountAddress,
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
} from "@snickerdoodlelabs/objects";

export interface IUnlockParams {
  accountAddress: EVMAccountAddress;
  signature: Signature;
  chain: EChain;
  languageCode: LanguageCode;
}

export interface IAddAccountParams {
  accountAddress: EVMAccountAddress;
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
export interface IAcceptInvitationParams {
  dataTypes: EWalletDataType[];
  id: UUID;
}
export interface IAcceptPublicInvitationByConsentContractAddressParams {
  dataTypes: EWalletDataType[];
  consentContractAddress: EVMContractAddress;
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
export interface IMetatransactionSignatureRequestCallbackParams {
  id: UUID;
  metatransactionSignature: Signature;
  nonce: BigNumberString;
}

export interface ILeaveCohortParams {
  consentContractAddress: EVMContractAddress;
}

export interface IGetUnlinkRequestParams {
  accountAddress: EVMAccountAddress;
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
