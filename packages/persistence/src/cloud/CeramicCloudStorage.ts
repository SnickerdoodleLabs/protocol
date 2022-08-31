import { CeramicClient } from "@ceramicnetwork/http-client";
import { StreamID } from "@ceramicnetwork/streamid";
import { IDX } from "@ceramicstudio/idx";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
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

type BackupItem = {
  id: string;
  timestamp: number;
};

type BackupIndex = {
  backups: Array<BackupItem>;
};

@injectable()
export class CeramicCloudStorage implements ICloudStorage {
  private _lastRestore = 0;
  private _ceramic?: CeramicClient;

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

  private _getIDX(
    ceramic: CeramicClient,
  ): ResultAsync<BackupIndex, PersistenceError> {
    // Create the IDX instance with the definitions aliases from the config
    const idx = new IDX({ ceramic: ceramic, aliases: modelAliases });

    // Load the existing notes
    return ResultAsync.fromPromise(
      idx.get<BackupIndex>("backups"),
      (e) => e as PersistenceError,
    ).map((index) => index ?? { backups: [] });
    return okAsync({ backups: [] });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    return this._getCeramic().andThen((ceramic) => {
      const model = new DataModel({
        ceramic: ceramic,
        aliases: modelAliases,
      });

      return ResultAsync.fromPromise(
        model.createTile("DataWalletBackup", backup),
        (e) => e as PersistenceError,
      ).map((tileDoc) => tileDoc.id.toString());
    });
    throw new Error("not implemented");
  }

  public pollBackups(
    startTime: number,
  ): ResultAsync<IDataWalletBackup[], PersistenceError> {
    // this._getCeramic().andThen((ceramic) => {
    //   const model = new DataModel({
    //     ceramic: ceramic,
    //     aliases: modelAliases,
    //   });
    //   const store = new DIDDataStore({
    //     ceramic: ceramic,
    //     model: model,
    //   });

    //   store.set;

    //   model.set();
    // });

    throw new Error("Method not implemented.");
  }

  public lastRestore(): ResultAsync<number, PersistenceError> {
    return okAsync(this._lastRestore);
  }
}
