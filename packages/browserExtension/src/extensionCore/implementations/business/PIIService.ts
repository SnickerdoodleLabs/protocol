import { IPIIService } from "@interfaces/business";
import { IPIIRepository } from "@interfaces/data";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
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

export class PIIService implements IPIIService {
  constructor(protected piiRespository: IPIIRepository) {}

  public setAge(age: Age): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setAge(age);
  }
  public getAge(): ResultAsync<Age | null, SnickerDoodleCoreError> {
    return this.piiRespository.getAge();
  }
  public setGivenName(
    name: GivenName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setGivenName(name);
  }
  public getGivenName(): ResultAsync<GivenName | null, SnickerDoodleCoreError> {
    return this.piiRespository.getGivenName();
  }
  public setFamilyName(
    name: FamilyName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setFamilyName(name);
  }
  public getFamilyName(): ResultAsync<
    FamilyName | null,
    SnickerDoodleCoreError
  > {
    return this.piiRespository.getFamilyName();
  }
  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setBirthday(birthday);
  }
  public getBirthday(): ResultAsync<
    UnixTimestamp | null,
    SnickerDoodleCoreError
  > {
    return this.piiRespository.getBirthday();
  }
  public setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setGender(gender);
  }
  public getGender(): ResultAsync<Gender | null, SnickerDoodleCoreError> {
    return this.piiRespository.getGender();
  }
  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setEmail(email);
  }
  public getEmail(): ResultAsync<
    EmailAddressString | null,
    SnickerDoodleCoreError
  > {
    return this.piiRespository.getEmail();
  }
  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setLocation(location);
  }
  public getLocation(): ResultAsync<
    CountryCode | null,
    SnickerDoodleCoreError
  > {
    return this.piiRespository.getLocation();
  }
}
