import {
  GivenName,
  PersistenceError,
  FamilyName,
  UnixTimestamp,
  Gender,
  EmailAddressString,
  CountryCode,
  Age,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IProfileService {
  setGivenName(name: GivenName): ResultAsync<void, PersistenceError>;

  getGivenName(): ResultAsync<GivenName, PersistenceError>;

  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError>;

  getFamilyName(): ResultAsync<FamilyName, PersistenceError>;

  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError>;

  getBirthday(): ResultAsync<UnixTimestamp, PersistenceError>;

  setGender(gender: Gender): ResultAsync<void, PersistenceError>;

  getGender(): ResultAsync<Gender, PersistenceError>;

  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError>;

  getEmail(): ResultAsync<EmailAddressString, PersistenceError>;

  setLocation(location: CountryCode): ResultAsync<void, PersistenceError>;

  getLocation(): ResultAsync<CountryCode, PersistenceError>;

  setAge(age: Age): ResultAsync<void, PersistenceError>;

  getAge(): ResultAsync<Age, PersistenceError>;
}

export const IProfileServiceType = Symbol.for("IProfileService");
