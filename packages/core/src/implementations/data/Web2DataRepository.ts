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
} from "@snickerdoodlelabs/objects";
import { EFieldKey } from "@snickerdoodlelabs/persistence";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IWeb2DataRepository,
} from "@core/interfaces/data/index.js";

export class Web2DataRepository implements IWeb2DataRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.getBirthday().map((birthdayEpoch) => {
      if (birthdayEpoch == null) {
        return null;
      }
      return Age(
        new Date(Date.now() - birthdayEpoch * 1000).getFullYear() -
          new Date(0).getFullYear(),
      );
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
