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
  ) {}

  public getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.getBirthday().map((birthdayEpoch) => {
      if (birthdayEpoch == null) {
        return null;
      }

      let ageYear =
        new Date(Date.now()).getFullYear() -
        new Date(birthdayEpoch * 1000).getFullYear();
      const ageMonth =
        new Date(Date.now()).getMonth() -
        new Date(birthdayEpoch * 1000).getMonth();
      const dateBirthday = new Date(birthdayEpoch * 1000).getDate();
      const dateToday = new Date(Date.now()).getDate();

      if (ageMonth < 0 || (ageMonth == 0 && dateToday < dateBirthday)) {
        ageYear = ageYear - 1;
      }

      return Age(ageYear);
    });
  }

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.FIRST_NAME,
      name,
      EBackupPriority.NORMAL,
    );
  }

  public getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this.persistence.getField(
      EFieldKey.FIRST_NAME,
      EBackupPriority.NORMAL,
    );
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.LAST_NAME,
      name,
      EBackupPriority.NORMAL,
    );
  }

  public getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this.persistence.getField(
      EFieldKey.LAST_NAME,
      EBackupPriority.NORMAL,
    );
  }

  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.BIRTHDAY,
      birthday,
      EBackupPriority.HIGH,
    );
  }

  public getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.BIRTHDAY, EBackupPriority.HIGH);
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.GENDER,
      gender,
      EBackupPriority.HIGH,
    );
  }

  public getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.GENDER, EBackupPriority.HIGH);
  }

  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.EMAIL,
      email,
      EBackupPriority.NORMAL,
    );
  }

  public getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.EMAIL, EBackupPriority.NORMAL);
  }

  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.LOCATION,
      location,
      EBackupPriority.HIGH,
    );
  }

  public getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this.persistence.getField(EFieldKey.LOCATION, EBackupPriority.HIGH);
  }
}
