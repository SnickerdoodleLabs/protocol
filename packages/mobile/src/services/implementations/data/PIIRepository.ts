import {
  Age,
  GivenName,
  FamilyName,
  UnixTimestamp,
  Gender,
  EmailAddressString,
  CountryCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IPIIRepository } from "../../interfaces/data/IPIIRepository";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

export class PIIRepository implements IPIIRepository {
  getAge(): ResultAsync<Age | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  setGivenName(name: GivenName): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getGivenName(): ResultAsync<GivenName | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  setFamilyName(name: FamilyName): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getFamilyName(): ResultAsync<FamilyName | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getBirthday(): ResultAsync<UnixTimestamp | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getGender(): ResultAsync<Gender | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getEmail(): ResultAsync<EmailAddressString | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  setLocation(
    location: CountryCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getLocation(): ResultAsync<CountryCode | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
}
