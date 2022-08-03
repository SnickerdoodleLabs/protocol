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

  getGivenName(): ResultAsync<GivenName | null, PersistenceError>;

  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError>;

  getFamilyName(): ResultAsync<FamilyName | null, PersistenceError>;

  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError>;

  getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError>;

  setGender(gender: Gender): ResultAsync<void, PersistenceError>;

  getGender(): ResultAsync<Gender | null, PersistenceError>;

  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError>;

  getEmail(): ResultAsync<EmailAddressString | null, PersistenceError>;

  setLocation(location: CountryCode): ResultAsync<void, PersistenceError>;

  getLocation(): ResultAsync<CountryCode | null, PersistenceError>;

  setAge(age: Age): ResultAsync<void, PersistenceError>;

  getAge(): ResultAsync<Age | null, PersistenceError>;
}

export const IProfileServiceType = Symbol.for("IProfileService");
