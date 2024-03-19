import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  ERecordKey,
  IIndexedDB,
  PersistenceError,
  VersionedObject,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import {
  IIndexedDBContextProvider,
  IIndexedDBContextProviderType,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { kmeans } from "ml-kmeans";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { replaceTscAliasPaths } from "tsc-alias";

import { IQuantizationService, InferenceResult } from "@vector-db/index.js";

@injectable()
export class VectorDB implements IQuantizationService {
  protected embeddedDB: Map<ERecordKey, number[][]> = new Map<
    ERecordKey,
    number[][]
  >();

  private _unlockPromise: Promise<IIndexedDB>;
  private _resolveUnlock: ((db: IIndexedDB) => void) | null = null;

  public constructor(
    @inject(IIndexedDBContextProviderType)
    protected indexedDBContextProvider: IIndexedDBContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {
    this._unlockPromise = new Promise<IIndexedDB>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  protected waitForInit(): ResultAsync<IIndexedDB, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  /*
    Initializes the vector db by viewing the indexed db.  
    If Optional @param template is fed, the vector db will view this instead of the default indexed db. 
  */
  public initialize(
    template?: IIndexedDB,
  ): ResultAsync<IIndexedDB, PersistenceError> {
    if (template !== undefined) {
      return this.indexedDBContextProvider
        .setContext({ db: template })
        .map(() => template);
    }

    return this.indexedDBContextProvider
      .getContext()
      .map((context) => context.db);
  }

  public table<T extends VersionedObject>(
    name: string,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    console.log("table name: " + name);
    return this.indexedDBContextProvider.getContext().andThen((context) => {
      console.log("context: " + JSON.stringify(context));
      return context.db.getAll<T>(name);
    });
  }

  /*
    Returns quantized instance of a table, following the rules of your imported function
  */
  public quantizeTable(
    tableName: ERecordKey,
    callback: (n: any) => any,
  ): ResultAsync<number[][], PersistenceError> {
    return this.indexedDBContextProvider
      .getContext()
      .andThen((context) => {
        return context.db.getAll(tableName);
      })
      .map((records) => {
        console.log("records");
        return records.map((record) => {
          return callback(record);
        });
      });
  }

  // Compute the K - clusters
  public kmeans(
    quantizedTable: number[][],
    k: number,
  ): ResultAsync<KMeansResult, PersistenceError> {
    const result = kmeans(quantizedTable, k, {
      // distanceFunction?: (p: number[], q: number[]) => number;
      // tolerance?: number;
      initialization: "kmeans++",
      maxIterations: 1000,
    });
    return okAsync(result);
  }

  public infer(
    model: KMeansResult,
    userState: number[][],
  ): ResultAsync<InferenceResult, PersistenceError> {
    return okAsync({
      data: model.nearest([[]]),
    } as InferenceResult);
  }

  private getDataPath(key: ERecordKey): string {
    switch (key) {
      case ERecordKey.NFTS:
        return "data.nft";
      default:
        return "data";
    }
  }
}
