import {
    IAxiosAjaxUtils,
    IAxiosAjaxUtilsType,
    AxiosAjaxUtils,
    CryptoUtils,
    ICryptoUtilsType,
    ILogUtilsType,
    ILogUtils,
} from "@snickerdoodlelabs/common-utils";
import {
    IInsightPlatformRepository,
    IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import {
    EVMPrivateKey,
    DataWalletBackup,
    PersistenceError,
    AjaxError,
    DataWalletBackupID,
    DataWalletBackupHeader,
    EBackupPriority,
    BackupFileName,
    StorageKey,
    ECloudStorageType,
    ERecordKey,
    VolatileStorageKey,
    AccessToken,
    AccessCode,
    RefreshToken,
    AccessTokenError,
} from "@snickerdoodlelabs/objects";
import {
    Dropbox,
    DropboxAuth,
    DropboxResponse,
    DropboxResponseError,
} from "dropbox";
import { inject, injectable } from "inversify";
import { Err, ok, okAsync, Result, ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
    IDropboxFileBackup,
    IDropboxWalletBackupDirectory,
} from "@persistence/cloud/IDropboxBackup.js";
import {
    IGoogleFileBackup,
    IGoogleWalletBackupDirectory,
} from "@persistence/cloud/IGoogleBackup.js";
import {
    IPersistenceConfigProvider,
    IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";

@injectable()
export class LocalDiskStorage implements ICloudStorage {
    protected _backups = new Map<string, DataWalletBackup>();
    protected _lastRestore = 0;
    private _unlockPromise: Promise<EVMPrivateKey>;
    private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
        null;
    private refreshToken: RefreshToken = RefreshToken("");

    public constructor(
        @inject(IPersistenceConfigProviderType)
        protected _configProvider: IPersistenceConfigProvider,
        @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
        @inject(IInsightPlatformRepositoryType)
        protected insightPlatformRepo: IInsightPlatformRepository,
        @inject(IAxiosAjaxUtilsType)
        protected ajaxUtils: AxiosAjaxUtils,
        @inject(ILogUtilsType) protected logUtils: ILogUtils,
    ) {
        this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
            this._resolveUnlock = resolve;
        });
    }
    type(): ECloudStorageType {
        throw new Error("Method not implemented.");
    }
    readBeforeUnlock(
        key: string,
    ): ResultAsync<DataWalletBackup, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    writeBeforeUnlock(
        backup: DataWalletBackup,
    ): ResultAsync<void, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    putBackup(
        backup: DataWalletBackup,
    ): ResultAsync<DataWalletBackupID, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    pollBackups(
        restored: Set<DataWalletBackupID>,
    ): ResultAsync<DataWalletBackup[], PersistenceError> {
        throw new Error("Method not implemented.");
    }
    unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    pollByStorageType(
        restored: Set<DataWalletBackupID>,
        recordKey: StorageKey,
    ): ResultAsync<DataWalletBackup[], PersistenceError> {
        throw new Error("Method not implemented.");
    }
    getLatestBackup(
        storageKey: StorageKey,
    ): ResultAsync<DataWalletBackup | null, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    clear(): ResultAsync<void, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    copy(): ResultAsync<void, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
        throw new Error("Method not implemented.");
    }
    fetchBackup(
        backupHeader: string,
    ): ResultAsync<DataWalletBackup[], PersistenceError> {
        throw new Error("Method not implemented.");
    }
}
