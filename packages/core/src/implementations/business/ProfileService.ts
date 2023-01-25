import {
  GivenName,
  PersistenceError,
  FamilyName,
  Gender,
  EmailAddressString,
  CountryCode,
  Age,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IProfileService } from "@core/interfaces/business/index.js";
import {
  IWeb2DataRepository,
  IWeb2DataRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(IWeb2DataRepositoryType)
    protected web2DataRepo: IWeb2DataRepository,
  ) {}

  setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.web2DataRepo.setGivenName(name);
  }
  getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this.web2DataRepo.getGivenName();
  }
  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.web2DataRepo.setFamilyName(name);
  }
  getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this.web2DataRepo.getFamilyName();
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    return this.web2DataRepo.setBirthday(birthday);
  }
  getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this.web2DataRepo.getBirthday();
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.web2DataRepo.setGender(gender);
  }
  getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this.web2DataRepo.getGender();
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    return this.web2DataRepo.setEmail(email);
  }
  getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this.web2DataRepo.getEmail();
  }
  setLocation(location: CountryCode): ResultAsync<void, PersistenceError> {
    return this.web2DataRepo.setLocation(location);
  }
  getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this.web2DataRepo.getLocation();
  }
  getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.web2DataRepo.getAge();
  }
}
