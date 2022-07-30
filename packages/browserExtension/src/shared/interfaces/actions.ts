import {
  Age,
  CountryCodeLetter,
  CountryCodeNumber,
  EmailAddressString,
  EVMAccountAddress,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
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
  location: CountryCodeLetter | CountryCodeNumber;
}
