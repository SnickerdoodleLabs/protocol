import {
  GivenName,
  PersistenceError,
  FamilyName,
  Gender,
  EmailAddressString,
  CountryCode,
  Age,
  Birthday,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IProfileService {
  setGivenName(name: GivenName): ResultAsync<void, PersistenceError>;

  getGivenName(): ResultAsync<GivenName | null, PersistenceError>;

  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError>;

  getFamilyName(): ResultAsync<FamilyName | null, PersistenceError>;

  setBirthday(birthday: Birthday): ResultAsync<void, PersistenceError>;

  getBirthday(): ResultAsync<Birthday | null, PersistenceError>;

  setGender(gender: Gender): ResultAsync<void, PersistenceError>;

  getGender(): ResultAsync<Gender | null, PersistenceError>;

  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError>;

  getEmail(): ResultAsync<EmailAddressString | null, PersistenceError>;

  setLocation(location: CountryCode): ResultAsync<void, PersistenceError>;

  getLocation(): ResultAsync<CountryCode | null, PersistenceError>;

  getAge(): ResultAsync<Age | null, PersistenceError>;
}

export const IProfileServiceType = Symbol.for("IProfileService");
