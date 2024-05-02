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
import { ResultAsync, okAsync } from "neverthrow";

import timezoneList from "@core/implementations/data/timezoneList.json" assert { type: "json" };
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IDemographicDataRepository,
} from "@core/interfaces/data/index.js";

@injectable()
export class DemographicDataRepository implements IDemographicDataRepository {
  private _timeZoneList?: ResultAsync<ITimeZoneObject, PersistenceError>;

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
    return this.persistence
      .getField<CountryCode | null>(EFieldKey.LOCATION)
      .andThen((location) => {
        if (location == null) {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (timezone === "" || !timezone) {
            return okAsync(null);
          }
          return this.timezoneList
            .andThen((timezoneList) => {
              const _country = timezoneList?.[timezone]?.c?.[0];
              if (!_country) {
                return okAsync(null);
              }
              return this.setLocation(CountryCode(_country)).andThen(() => {
                return okAsync(CountryCode(_country));
              });
            })
            .mapErr((error) => {
              return error;
            });
        }
        return okAsync(location);
      })
      .mapErr((error) => {
        return error;
      });
  }

  private get timezoneList() {
    if (this._timeZoneList) {
      return this._timeZoneList;
    }
    this._timeZoneList = ResultAsync.fromPromise(
      import("./timezoneList.json", {
        assert: { type: "json" },
      }).then((module) => module.default as ITimeZoneObject),
      (error) =>
        new PersistenceError(`Error importing timezone list: ${error}`),
    );
    return this._timeZoneList;
  }
}

interface ITimeZoneObject {
  [key: string]: {
    c?: string[];
    [key: number | string]: any;
  };
}
