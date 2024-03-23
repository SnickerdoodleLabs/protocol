import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  ERecordKey,
  IIndexedDB,
  VectorDBError,
  QuantizedTableId,
  VersionedObject,
  VolatileStorageMetadata,
  PersistenceError,
  VectorRow,
  QuantizedTable,
  SemanticRow,
} from "@snickerdoodlelabs/objects";
import {
  IIndexedDBContextProvider,
  IIndexedDBContextProviderType,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import normed from "ml-array-normed";
import { kmeans } from "ml-kmeans";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { err, errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import transpose from "transpose-2d-array";

import { IVectorDB } from "@vector-db/index.js";
import { InferenceResult } from "@vector-db/objects/index.js";

@injectable()
export class VectorDB implements IVectorDB {
  protected embeddedMappings: ResultAsync<
    Map<QuantizedTableId, QuantizedTable>,
    never
  >;
  private _initPromise: Promise<IIndexedDB>;
  private _resolveUnlock: ((db: IIndexedDB) => void) | null = null;

  public constructor(
    @inject(IIndexedDBContextProviderType)
    protected indexedDBContextProvider: IIndexedDBContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {
    this.embeddedMappings = okAsync(
      new Map<QuantizedTableId, QuantizedTable>(),
    );
    this._initPromise = new Promise<IIndexedDB>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  /*
    Initializes the vector db by viewing the indexed db.  
    If Optional @param template is fed, the vector db will view this instead of the default indexed db. 
  */
  public initialize(
    template?: IIndexedDB,
  ): ResultAsync<IIndexedDB, PersistenceError> {
    this.embeddedMappings = okAsync(
      new Map<QuantizedTableId, QuantizedTable>(),
    );
    this._initPromise = new Promise<IIndexedDB>((resolve) => {
      this._resolveUnlock = resolve;
    });

    if (template !== undefined) {
      return this.indexedDBContextProvider
        .setContext({ db: template })
        .map(() => template);
    }

    return this.indexedDBContextProvider
      .getContext()
      .map((context) => context.db);
  }

  /*
    Returns table metadata based off their table name
  */
  public table<T extends VersionedObject>(
    name: string,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this.indexedDBContextProvider.getContext().andThen((context) => {
      return context.db.getAll<T>(name);
    });
  }

  /**
   * Returns a new table instance made up of existing tables and then quantizes this table to make it ready for unsupervised ml algorithms
   * @param tableNames is an array of the different tableNames you want to feed into create
   * @param callbacks is an array of function converters that allows the user to convert row data into numeric data
   * @param outputName output table name that is the identifier for your new quantized table
   */
  public quantizeTable<T extends VersionedObject>(
    tableNames: ERecordKey[],
    callbacks: ((row: VolatileStorageMetadata<VersionedObject>) => VectorRow)[],
    outputName: QuantizedTableId,
  ): ResultAsync<QuantizedTable, PersistenceError | VectorDBError> {
    return ResultUtils.combine(
      tableNames.map((tableName, index) => {
        return this.table(tableName)
          .map((tableData) => {
            return tableData.map((row) => {
              const callback = callbacks[index];
              return callback(row);
            });
          })
          .mapErr((e) => e);
      }),
    )
      .andThen((data) => {
        const vals = data.flat();

        return this.normalizeQuantizedTable(vals).andThen((normalizedData) => {
          return this.addQuantizedData(
            outputName,
            new QuantizedTable(outputName, normalizedData),
          );
        });
      })
      .mapErr((err) => {
        return new VectorDBError(
          `Formatting Error: Callback function does not convert data from ${tableNames} into a legible, numeric output`,
        );
      });
  }

  /*
    Returns kmeans instance of a quantized table
  */
  public kmeans(
    tableName: QuantizedTableId,
    k: number,
  ): ResultAsync<KMeansResult, VectorDBError> {
    return this.getQuantizedData(tableName)
      .map((quantizedTable) => {
        const result = kmeans(quantizedTable.table(), k, {
          initialization: "kmeans++",
          maxIterations: 1000,
        });
        return result;
      })
      .mapErr((e) => e);
  }

  /*
    Returns an inference off of your Kmeans instance
  */
  public infer(
    model: KMeansResult,
    userState: number[][],
  ): ResultAsync<InferenceResult, VectorDBError> {
    return okAsync({
      data: model.nearest(userState),
    } as InferenceResult);
  }

  public viewTables(): ResultAsync<
    Map<QuantizedTableId, QuantizedTable>,
    never
  > {
    return this.embeddedMappings;
  }

  protected waitForInit(): ResultAsync<IIndexedDB, never> {
    return ResultAsync.fromSafePromise(this._initPromise);
  }

  private normalizeQuantizedTable(
    table: VectorRow[],
  ): ResultAsync<number[][], VectorDBError> {
    const transposedTable = transpose(table);
    const normalization = transposedTable.map((row) => {
      return normed(row, { algorithm: "max" });
    });
    return okAsync(transpose(normalization));
  }

  private addQuantizedData(
    tableName: QuantizedTableId,
    data: QuantizedTable,
  ): ResultAsync<QuantizedTable, VectorDBError> {
    return this.embeddedMappings
      .map((table) => {
        table = table.set(tableName, data);
        this.embeddedMappings = okAsync(table);
        return data;
      })
      .mapErr(
        (e) => new VectorDBError(`Quantized Table ${tableName} is not found`),
      );
  }

  private getQuantizedData(
    tableName: QuantizedTableId,
  ): ResultAsync<QuantizedTable, VectorDBError> {
    return this.embeddedMappings
      .map((table) => {
        const data = table.get(tableName);
        if (data == undefined) {
          throw err;
        }

        return data;
      })
      .mapErr(
        (e) => new VectorDBError(`Quantized Table ${tableName} is not found`),
      );
  }
}
