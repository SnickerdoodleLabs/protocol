import {
  Age,
  GivenName,
  FamilyName,
  Gender,
  EmailAddressString,
  CountryCode,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IPIIService {
  getAge(): ResultAsync<Age | null, SnickerDoodleCoreError>;
  setGivenName(name: GivenName): ResultAsync<void, SnickerDoodleCoreError>;
  getGivenName(): ResultAsync<GivenName | null, SnickerDoodleCoreError>;
  setFamilyName(name: FamilyName): ResultAsync<void, SnickerDoodleCoreError>;
  getFamilyName(): ResultAsync<FamilyName | null, SnickerDoodleCoreError>;
  setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getBirthday(): ResultAsync<UnixTimestamp | null, SnickerDoodleCoreError>;
  setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError>;
  getGender(): ResultAsync<Gender | null, SnickerDoodleCoreError>;
  setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError>;
  getEmail(): ResultAsync<EmailAddressString | null, SnickerDoodleCoreError>;
  setLocation(location: CountryCode): ResultAsync<void, SnickerDoodleCoreError>;
  getLocation(): ResultAsync<CountryCode | null, SnickerDoodleCoreError>;
}

export const IPIIServiceType = Symbol.for("IPIIService");
