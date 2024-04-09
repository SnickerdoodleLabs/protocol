/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BackupManager } from "@persistence/backup/BackupManager.js";
import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IBackupManagerProvider } from "@persistence/backup/IBackupManagerProvider.js";
import {
  IBackupUtils,
  IBackupUtilsType,
} from "@persistence/backup/IBackupUtils.js";
import {
  IChunkRendererFactory,
  IChunkRendererFactoryType,
} from "@persistence/backup/IChunkRendererFactory.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import {
  IFieldSchemaProvider,
  IFieldSchemaProviderType,
} from "@persistence/local/IFieldSchemaProvider.js";
import {
  IVolatileStorage,
  IVolatileStorageType,
} from "@persistence/volatile/index.js";
import {
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
} from "@persistence/volatile/IVolatileStorageSchemaProvider.js";

@injectable()
export class BackupManagerProvider implements IBackupManagerProvider {
  private backupManager?: ResultAsync<IBackupManager, never>;

  public constructor(
    @inject(IVolatileStorageType) protected volatileStorage: IVolatileStorage,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IVolatileStorageSchemaProviderType)
    protected recordSchemaProvider: IVolatileStorageSchemaProvider,
    @inject(IFieldSchemaProviderType)
    protected fieldSchemaProvider: IFieldSchemaProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(IBackupUtilsType) protected backupUtils: IBackupUtils,
    @inject(IChunkRendererFactoryType)
    protected chunkRendererFactory: IChunkRendererFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getBackupManager(): ResultAsync<IBackupManager, never> {
    if (this.backupManager != undefined) {
      return this.backupManager;
    }

    this.backupManager = ResultUtils.combine([
      this.recordSchemaProvider.getVolatileStorageSchema(),
      this.fieldSchemaProvider.getLocalStorageSchema(),
    ]).map(([recordSchema, fieldSchema]) => {
      return new BackupManager(
        Array.from(recordSchema.values()),
        Array.from(fieldSchema.values()),
        this.cryptoUtils,
        this.volatileStorage,
        this.storageUtils,
        this.timeUtils,
        this.backupUtils,
        this.chunkRendererFactory,
        this.recordSchemaProvider,
        this.logUtils,
      );
    });
    return this.backupManager;
  }
}
