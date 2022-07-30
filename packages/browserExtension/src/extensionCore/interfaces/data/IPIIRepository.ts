import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Age,
  CountryCodeLetter,
  CountryCodeNumber,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPIIRepository {
  setAge(age: Age): ResultAsync<void, SnickerDoodleCoreError>;
  getAge(): ResultAsync<Age, SnickerDoodleCoreError>;
  setGivenName(name: GivenName): ResultAsync<void, SnickerDoodleCoreError>;
  getGivenName(): ResultAsync<GivenName, SnickerDoodleCoreError>;
  setFamilyName(name: FamilyName): ResultAsync<void, SnickerDoodleCoreError>;
  getFamilyName(): ResultAsync<FamilyName, SnickerDoodleCoreError>;
  setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getBirthday(): ResultAsync<UnixTimestamp, SnickerDoodleCoreError>;
  setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError>;
  getGender(): ResultAsync<Gender, SnickerDoodleCoreError>;
  setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getEmail(): ResultAsync<EmailAddressString, SnickerDoodleCoreError>;
  setLocation(location: CountryCodeLetter | CountryCodeNumber): ResultAsync<void, SnickerDoodleCoreError>;
  getLocation(): ResultAsync<CountryCodeLetter | CountryCodeNumber, SnickerDoodleCoreError>;
}
