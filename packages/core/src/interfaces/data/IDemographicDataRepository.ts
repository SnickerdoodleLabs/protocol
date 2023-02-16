import {
  Age,
  PersistenceError,
  GivenName,
  FamilyName,
  UnixTimestamp,
  Gender,
  EmailAddressString,
  CountryCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDemographicDataRepository {
  /** Google User Information */
  getAge(): ResultAsync<Age | null, PersistenceError>;

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
}

export const IDemographicDataRepositoryType = Symbol.for("IWeb2DataRepository");
