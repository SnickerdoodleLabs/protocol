import { EBackupPriority, EFieldKey } from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import { FieldIndex } from "@persistence/local/FieldIndex.js";
import { ILocalStorageSchemaProvider } from "@persistence/local/IFieldSchemaProvider.js";

export class LocalStorageSchemaProvider implements ILocalStorageSchemaProvider {
  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
  ) {}

  public getLocalStorageSchema(): ResultAsync<FieldIndex[], never> {
    return this.configProvider.getConfig().map((config) => {
      return [
        new FieldIndex(
          EFieldKey.ACCEPTED_INVITATIONS,
          EBackupPriority.HIGH,
          config.dataWalletBackupIntervalMS,
        ),
        new FieldIndex(
          EFieldKey.BIRTHDAY,
          EBackupPriority.HIGH,
          0, // instant push
        ),
        new FieldIndex(
          EFieldKey.DEFAULT_RECEIVING_ADDRESS,
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
        ),
        new FieldIndex(
          EFieldKey.DOMAIN_PERMISSIONS,
          EBackupPriority.HIGH,
          config.dataWalletBackupIntervalMS,
        ),
        new FieldIndex(
          EFieldKey.EMAIL,
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
        ),
        new FieldIndex(EFieldKey.FIRST_NAME, EBackupPriority.HIGH, 0),
        new FieldIndex(EFieldKey.GENDER, EBackupPriority.HIGH, 0),
        new FieldIndex(EFieldKey.LAST_NAME, EBackupPriority.HIGH, 0),
        new FieldIndex(EFieldKey.LOCATION, EBackupPriority.HIGH, 0),
        new FieldIndex(
          EFieldKey.REJECTED_COHORTS,
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
        ),
      ];
    });
  }
}
