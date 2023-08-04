import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  AuthenticatedStorageSettings,
  EarnedReward,
  EFieldKey,
  ERecordKey,
  EVMContractAddress,
  LinkedAccount,
  PersistenceError,
  ReceivingAccount,
  JSONString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAuthenticatedStorageRepository } from "@core/interfaces/data/index.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/utilities/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class AuthenticatedStorageRepository
  implements IAuthenticatedStorageRepository
{
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public saveCredentials(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.AUTHENTICATED_STORAGE_SETTINGS,
      settings,
    );
  }

  public getCredentials(): ResultAsync<
    AuthenticatedStorageSettings | null,
    PersistenceError
  > {
    return this.persistence.getField<AuthenticatedStorageSettings>(
      EFieldKey.AUTHENTICATED_STORAGE_SETTINGS,
    );
  }

  public activateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.activateAuthenticatedStorage(settings);
  }
}
