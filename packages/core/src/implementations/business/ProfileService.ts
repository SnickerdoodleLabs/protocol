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
import { ResultAsync } from "neverthrow";

import { IProfileService } from "@core/interfaces/business/index.js";
import {
  IDemographicDataRepository,
  IDemographicDataRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(IDemographicDataRepositoryType)
    protected demographicDataRepo: IDemographicDataRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.demographicDataRepo.setGivenName(name);
  }
  getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this.demographicDataRepo.getGivenName();
  }
  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.demographicDataRepo.setFamilyName(name);
  }
  getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this.demographicDataRepo.getFamilyName();
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    return this.demographicDataRepo
      .setBirthday(birthday)
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .map((context) => {
        context.publicEvents.onBirthdayUpdated.next(birthday);
      });
  }
  getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this.demographicDataRepo.getBirthday();
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.demographicDataRepo
      .setGender(gender)
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .map((context) => {
        context.publicEvents.onGenderUpdated.next(gender);
      });
  }
  getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this.demographicDataRepo.getGender();
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    return this.demographicDataRepo.setEmail(email);
  }
  getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this.demographicDataRepo.getEmail();
  }
  setLocation(location: CountryCode): ResultAsync<void, PersistenceError> {
    return this.demographicDataRepo
      .setLocation(location)
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .map((context) => {
        context.publicEvents.onLocationUpdated.next(location);
      });
  }
  getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this.demographicDataRepo.getLocation();
  }
  getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.demographicDataRepo.getAge();
  }
}
