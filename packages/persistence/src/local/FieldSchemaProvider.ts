import { EBackupPriority, EFieldKey } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import { FieldIndex } from "@persistence/local/FieldIndex.js";
import { IFieldSchemaProvider } from "@persistence/local/IFieldSchemaProvider.js";

@injectable()
export class FieldSchemaProvider implements IFieldSchemaProvider {
  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
  ) {}

  public getLocalStorageSchema(): ResultAsync<
    Map<EFieldKey, FieldIndex>,
    never
  > {
    return this.configProvider.getConfig().map((config) => {
      return new Map([
        [
          EFieldKey.AUTHENTICATED_STORAGE_SETTINGS,
          new FieldIndex(
            EFieldKey.AUTHENTICATED_STORAGE_SETTINGS,
            EBackupPriority.DISABLED,
            0,
          ),
        ],
        [
          EFieldKey.DATA_WALLET_PRIVATE_KEY,
          new FieldIndex(
            EFieldKey.DATA_WALLET_PRIVATE_KEY,
            EBackupPriority.HIGH,
            0,
          ),
        ],
        [
          EFieldKey.BIRTHDAY,
          new FieldIndex(
            EFieldKey.BIRTHDAY,
            EBackupPriority.HIGH,
            0, // instant push
          ),
        ],
        [
          EFieldKey.DEFAULT_RECEIVING_ADDRESS,
          new FieldIndex(
            EFieldKey.DEFAULT_RECEIVING_ADDRESS,
            EBackupPriority.NORMAL,
            config.dataWalletBackupIntervalMS,
          ),
        ],
        [
          EFieldKey.DOMAIN_PERMISSIONS,
          new FieldIndex(
            EFieldKey.DOMAIN_PERMISSIONS,
            EBackupPriority.HIGH,
            config.dataWalletBackupIntervalMS,
          ),
        ],
        [
          EFieldKey.EMAIL,
          new FieldIndex(
            EFieldKey.EMAIL,
            EBackupPriority.NORMAL,
            config.dataWalletBackupIntervalMS,
          ),
        ],
        [
          EFieldKey.FIRST_NAME,
          new FieldIndex(EFieldKey.FIRST_NAME, EBackupPriority.HIGH, 0),
        ],
        [
          EFieldKey.GENDER,
          new FieldIndex(EFieldKey.GENDER, EBackupPriority.HIGH, 0),
        ],
        [
          EFieldKey.LAST_NAME,
          new FieldIndex(EFieldKey.LAST_NAME, EBackupPriority.HIGH, 0),
        ],
        [
          EFieldKey.LOCATION,
          new FieldIndex(EFieldKey.LOCATION, EBackupPriority.HIGH, 0),
        ],
      ]);
    });
  }
}
