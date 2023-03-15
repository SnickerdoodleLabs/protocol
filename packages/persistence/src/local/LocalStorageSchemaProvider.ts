import { EBackupPriority, EFieldKey } from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

import { LocalStorageIndex } from "./LocalStorageIndex";

import { IPersistenceConfig } from "@persistence/IPersistenceConfig.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import { ILocalStorageSchemaProvider } from "@persistence/local/ILocalStorageSchemaProvider.js";

export class LocalStorageSchemaProvider implements ILocalStorageSchemaProvider {
  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
  ) {}

  public getLocalStorageSchema(): ResultAsync<LocalStorageIndex[], never> {
    return this.configProvider.getConfig().map((config) => {
      return [
        new LocalStorageIndex(
          EFieldKey.ACCEPTED_INVITATIONS,
          EBackupPriority.HIGH,
          config.dataWalletBackupIntervalMS,
        ),
        new LocalStorageIndex(
          EFieldKey.BIRTHDAY,
          EBackupPriority.HIGH,
          0, // instant push
        ),
        new LocalStorageIndex(
          EFieldKey.DEFAULT_RECEIVING_ADDRESS,
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
        ),
        new LocalStorageIndex(
          EFieldKey.DOMAIN_PERMISSIONS,
          EBackupPriority.HIGH,
          config.dataWalletBackupIntervalMS,
        ),
        new LocalStorageIndex(
          EFieldKey.EMAIL,
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
        ),
        new LocalStorageIndex(EFieldKey.FIRST_NAME, EBackupPriority.HIGH, 0),
        new LocalStorageIndex(EFieldKey.GENDER, EBackupPriority.HIGH, 0),
        new LocalStorageIndex(EFieldKey.LAST_NAME, EBackupPriority.HIGH, 0),
        new LocalStorageIndex(EFieldKey.LOCATION, EBackupPriority.HIGH, 0),
        new LocalStorageIndex(
          EFieldKey.REJECTED_COHORTS,
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
        ),
      ];
    });
  }
}
