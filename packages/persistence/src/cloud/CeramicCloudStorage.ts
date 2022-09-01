import { CeramicClient } from "@ceramicnetwork/http-client";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { TileLoader } from "@glazed/tile-loader";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  EVMPrivateKey,
  IDataWalletBackup,
  PersistenceError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { DID } from "dids";
import { injectable } from "inversify";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICloudStorage } from "@persistence/cloud";

const modelAliases = {
  definitions: {
    backups: "kjzl6cwe1jw14886embcxqtwtbak30ygn1rzxf4o3p6bur5qts753kdd77ujshw",
  },
  schemas: {
    Backup:
      "ceramic://k3y52l7qbv1frym2l76mi7q0vc33wwuoxj968heukosypztxi1fejg2n0kdhk9wxs",
    BackupIndex:
      "ceramic://k3y52l7qbv1frykabczj1wy7f9sy3u49lwxfu73582sonuwbw3t0r6dfyqk15vaww",
  },
  tiles: {},
};

type BackupIndex = { id: string }[];

type ModelTypes = {
  schemas: {
    Backup: IDataWalletBackup;
    BackupIndex: BackupIndex;
  };
  definitions: {
    backups: "BackupIndex";
  };
  tiles: Record<string, never>;
};

@injectable()
export class CeramicCloudStorage implements ICloudStorage {
  private _ceramic?: CeramicClient;

  private _loader?: TileLoader;
  private _dataStore?: DIDDataStore<ModelTypes>;
  private _dataModel?: DataModel<ModelTypes>;

  private _restored: Set<string> = new Set();

  public constructor(
    protected _privateKey: EVMPrivateKey,
    protected _nodeURL: URLString,
    protected _cryptoUtils: CryptoUtils,
  ) {}

  private _getCeramic(): ResultAsync<CeramicClient, PersistenceError> {
    if (this._ceramic) {
      return okAsync(this._ceramic);
    }

    this._ceramic = new CeramicClient(this._nodeURL);
    return this._cryptoUtils
      .deriveCeramicSeedFromEVMPrivateKey(this._privateKey)
      .andThen((seed) => {
        console.log(new TextDecoder().decode(seed));
        return this._authenticateDID(seed).andThen((did) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._ceramic!.did = did;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return okAsync(this._ceramic!);
        });
      });
  }

  private _authenticateDID(
    seed: Uint8Array,
  ): ResultAsync<DID, PersistenceError> {
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: getResolver() });
    return ResultAsync.fromPromise(
      did.authenticate(),
      (e) => e as PersistenceError,
    ).andThen((_) => okAsync(did));
  }

  private _init(): ResultAsync<
    {
      store: DIDDataStore<ModelTypes>;
      model: DataModel<ModelTypes>;
      loader: TileLoader;
    },
    PersistenceError
  > {
    return this._getCeramic().andThen((ceramic) => {
      if (
        this._dataStore != undefined &&
        this._dataModel != undefined &&
        this._loader != undefined
      ) {
        return okAsync({
          store: this._dataStore,
          model: this._dataModel,
          loader: this._loader,
        });
      }

      this._loader = new TileLoader({ ceramic });
      this._dataModel = new DataModel({
        loader: this._loader,
        aliases: modelAliases,
      });
      this._dataStore = new DIDDataStore({
        ceramic,
        loader: this._loader,
        model: this._dataModel,
      });

      return okAsync({
        store: this._dataStore,
        model: this._dataModel,
        loader: this._loader,
      });
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    return this._init().andThen(({ store, model }) => {
      return ResultAsync.fromPromise(
        model.createTile("Backup", backup),
        (e) => e as PersistenceError,
      ).andThen((doc) => {
        const id = doc.id.toUrl();
        return ResultAsync.fromPromise(
          store.get("backups"),
          (e) => e as PersistenceError,
        ).andThen((backups) => {
          return ResultAsync.fromPromise(
            store.set("backups", [...(backups ?? []), { id: id }]),
            (e) => e as PersistenceError,
          ).map((_) => id);
        });
      });
    });
  }

  public pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return this._getBackupIndex().andThen((backups) => {
      const recent = backups.map((record) => record.id);
      const found = [...recent].filter((x) => this._restored.has(x));
      return ResultUtils.combine(
        found.map((backupID) => this._getBackup(backupID)),
      ).map((fetched) => {
        this._restored = new Set(recent);
        return fetched;
      });
    });
  }

  private _getBackup(
    id: string,
  ): ResultAsync<IDataWalletBackup, PersistenceError> {
    return this._init().andThen(({ loader }) => {
      return ResultAsync.fromPromise(
        loader.load<IDataWalletBackup>(id),
        (e) => e as PersistenceError,
      ).map((tileDoc) => tileDoc.content);
    });
  }

  private _getBackupIndex(): ResultAsync<BackupIndex, PersistenceError> {
    return this._init().andThen(({ store }) => {
      return ResultAsync.fromPromise(
        store.get("backups"),
        (e) => e as PersistenceError,
      ).map((backups) => backups ?? []);
    });
  }
}
