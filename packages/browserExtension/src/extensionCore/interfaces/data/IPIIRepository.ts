import {
  Age,
  Birthday,
  CountryCode,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@shared/objects/errors";

export interface IPIIRepository {
  getAge(): ResultAsync<Age | null, SnickerDoodleCoreError>;
  setGivenName(name: GivenName): ResultAsync<void, SnickerDoodleCoreError>;
  getGivenName(): ResultAsync<GivenName | null, SnickerDoodleCoreError>;
  setFamilyName(name: FamilyName): ResultAsync<void, SnickerDoodleCoreError>;
  getFamilyName(): ResultAsync<FamilyName | null, SnickerDoodleCoreError>;
  setBirthday(
    birthday: Birthday,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getBirthday(): ResultAsync<Birthday | null, SnickerDoodleCoreError>;
  setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError>;
  getGender(): ResultAsync<Gender | null, SnickerDoodleCoreError>;
  setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getEmail(): ResultAsync<EmailAddressString | null, SnickerDoodleCoreError>;
  setLocation(location: CountryCode): ResultAsync<void, SnickerDoodleCoreError>;
  getLocation(): ResultAsync<CountryCode | null, SnickerDoodleCoreError>;
}

export const IPIIRepositoryType = Symbol.for("IPIIRepository");
