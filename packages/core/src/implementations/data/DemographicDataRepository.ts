import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  Age,
  PersistenceError,
  GivenName,
  EBackupPriority,
  FamilyName,
  UnixTimestamp,
  Gender,
  EmailAddressString,
  CountryCode,
  EFieldKey,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IDemographicDataRepository,
} from "@core/interfaces/data/index.js";

@injectable()
export class DemographicDataRepository implements IDemographicDataRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.getBirthday().map((birthdayEpoch) => {
      if (birthdayEpoch == null) {
        return null;
      }

      const ageYear = Math.floor(
        (this.timeUtils.getUnixNow() - birthdayEpoch) / (60 * 60 * 24 * 365),
      );
      return Age(ageYear);
    });
  }

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(EFieldKey.FIRST_NAME, name);
  }

  public getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.FIRST_NAME);
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(EFieldKey.LAST_NAME, name);
  }

  public getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.LAST_NAME);
  }

  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(EFieldKey.BIRTHDAY, birthday);
  }

  public getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.BIRTHDAY);
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(EFieldKey.GENDER, gender);
  }

  public getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.GENDER);
  }

  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(EFieldKey.EMAIL, email);
  }

  public getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.EMAIL);
  }

  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(EFieldKey.LOCATION, location);
  }

  public getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.LOCATION);
  }
}
