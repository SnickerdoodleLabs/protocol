import {
  GivenName,
  PersistenceError,
  FamilyName,
  UnixTimestamp,
  Gender,
  EmailAddressString,
  CountryCode,
  Age,
  IDataWalletPersistenceType,
  IDataWalletPersistence,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IProfileService } from "@core/interfaces/business/index.js";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
  ) {}
  setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.setGivenName(name);
  }
  getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this.dataWalletPersistence.getGivenName();
  }
  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.setFamilyName(name);
  }
  getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this.dataWalletPersistence.getFamilyName();
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.setBirthday(birthday);
  }
  getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this.dataWalletPersistence.getBirthday();
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.setGender(gender);
  }
  getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this.dataWalletPersistence.getGender();
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.setEmail(email);
  }
  getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this.dataWalletPersistence.getEmail();
  }
  setLocation(location: CountryCode): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.setLocation(location);
  }
  getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this.dataWalletPersistence.getLocation();
  }

  public calculateAge(date_of_birth: UnixTimestamp | null): Age | null {
    console.log("Inside calculate age ", date_of_birth);

    if (!date_of_birth) return null;
    const today = Date.now();
    const ageDiff = new Date(today - date_of_birth * 1000);

    const age = Math.abs(ageDiff.getUTCFullYear() - 1970);

    return Age(age);
  }

  getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.dataWalletPersistence.getBirthday().andThen((birthday) => {
      return okAsync(this.calculateAge(birthday));
    });
  }
}
