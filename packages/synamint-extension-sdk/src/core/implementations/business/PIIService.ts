import {
  Age,
  GivenName,
  FamilyName,
  UnixTimestamp,
  Gender,
  EmailAddressString,
  CountryCode,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IPIIService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IPIIRepository,
  IPIIRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data";
import {
  IContextProviderType,
  IContextProvider,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared";

@injectable()
export class PIIService implements IPIIService {
  constructor(
    @inject(IPIIRepositoryType) protected piiRespository: IPIIRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

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
