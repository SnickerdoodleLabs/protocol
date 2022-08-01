import { IPIIRepository } from "@interfaces/data";
import { IErrorUtils } from "@interfaces/utilities";
import { SnickerDoodleCoreError } from "@shared/objects/errors";
import {
  Age,
  GivenName,
  FamilyName,
  UnixTimestamp,
  Gender,
  EmailAddressString,
  CountryCode,
  ISnickerdoodleCore,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class PIIRepository implements IPIIRepository {
  constructor(
    protected core: ISnickerdoodleCore,
    protected errorUtils: IErrorUtils,
  ) {}
  setAge(age: Age): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.setAge(age).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getAge(): ResultAsync<Age, SnickerDoodleCoreError> {
    return this.core.getAge().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  setGivenName(
    givenName: GivenName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.setGivenName(givenName).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getGivenName(): ResultAsync<GivenName, SnickerDoodleCoreError> {
    return this.core.getGivenName().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  setFamilyName(
    familyName: FamilyName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.setFamilyName(familyName).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getFamilyName(): ResultAsync<FamilyName, SnickerDoodleCoreError> {
    return this.core.getFamilyName().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.setBirthday(birthday).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getBirthday(): ResultAsync<UnixTimestamp, SnickerDoodleCoreError> {
    return this.core.getBirthday().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.setGender(gender).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getGender(): ResultAsync<Gender, SnickerDoodleCoreError> {
    return this.core.getGender().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.setEmail(email).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getEmail(): ResultAsync<EmailAddressString, SnickerDoodleCoreError> {
    return this.core.getEmail().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  setLocation(
    location: CountryCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.setLocation(location).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  getLocation(): ResultAsync<CountryCode, SnickerDoodleCoreError> {
    return this.core.getLocation().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
}
