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
  
  setAge(age: Age): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setAge(age);
  }
  getAge(): ResultAsync<Age, SnickerDoodleCoreError> {
    return this.piiRespository.getAge();
  }
  setGivenName(name: GivenName): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setGivenName(name);
  }
  getGivenName(): ResultAsync<GivenName, SnickerDoodleCoreError> {
    return this.piiRespository.getGivenName();
  }
  setFamilyName(name: FamilyName): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setFamilyName(name);
  }
  getFamilyName(): ResultAsync<FamilyName, SnickerDoodleCoreError> {
    return this.piiRespository.getFamilyName();
  }
  setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setBirthday(birthday);
  }
  getBirthday(): ResultAsync<UnixTimestamp, SnickerDoodleCoreError> {
    return this.piiRespository.getBirthday();
  }
  setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setGender(gender);
  }
  getGender(): ResultAsync<Gender, SnickerDoodleCoreError> {
    return this.piiRespository.getGender();
  }
  setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setEmail(email);
  }
  getEmail(): ResultAsync<EmailAddressString, SnickerDoodleCoreError> {
    return this.piiRespository.getEmail();
  }
  setLocation(
    location: CountryCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiRespository.setLocation(location);
  }
  getLocation(): ResultAsync<CountryCode, SnickerDoodleCoreError> {
    return this.piiRespository.getLocation();
  }
}
