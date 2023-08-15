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
  EBackupPriority,
} from "@snickerdoodlelabs/objects";
// import { FieldIndex } from "@persistence/local/FieldIndex.js";
import { FieldIndex } from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
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

  public clearCredentials(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    console.log("settings: " + JSON.stringify(settings));
    return this.getCredentials()
      .andThen((credentials) => {
        console.log("credentials 1: " + JSON.stringify(credentials));

        return this.persistence.updateField(
          EFieldKey.AUTHENTICATED_STORAGE_SETTINGS,
          new FieldIndex(
            EFieldKey.AUTHENTICATED_STORAGE_SETTINGS,
            EBackupPriority.DISABLED,
            0,
          ),
        );
      })
      .andThen(() => {
        return this.getCredentials();
      })
      .andThen((credentials) => {
        console.log("credentials 2: " + JSON.stringify(credentials));
        return okAsync(undefined);
      });
  }

  public getCredentials(): ResultAsync<
    AuthenticatedStorageSettings | null,
    PersistenceError
  > {
    return this.persistence
      .getField<AuthenticatedStorageSettings>(
        EFieldKey.AUTHENTICATED_STORAGE_SETTINGS,
      )
      .andThen((credentials) => {
        console.log("credentials: " + credentials);

        return this.persistence.getField<AuthenticatedStorageSettings>(
          EFieldKey.AUTHENTICATED_STORAGE_SETTINGS,
        );
      });
  }

  public activateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.activateAuthenticatedStorage(settings);
  }

  public deactivateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.deactivateAuthenticatedStorage(settings);
  }
}
