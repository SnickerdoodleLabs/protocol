import {
  IIndexedDB,
  ERecordKey,
  VersionedObject,
  VolatileStorageMetadata,
  VectorDBError,
  QuantizedTableId,
  PersistenceError,
  VectorRow,
  QuantizedTable,
  SemanticRow,
} from "@snickerdoodlelabs/objects";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { ResultAsync } from "neverthrow";

import { InferenceResult } from "@vector-db/objects/index.js";

export interface IVectorDB {
  /*
    Initializes the vector db by viewing the indexed db.  
    If Optional @param template is fed, the vector db will view this instead of the default indexed db. 
  */
  initialize(template?: IIndexedDB): ResultAsync<IIndexedDB, PersistenceError>;

  /*
    Returns table metadata based off their table name
  */
  table<T extends VersionedObject>(
    name: string,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;

  /*
    Returns quantized instance of a table, following the rules of your imported function
  */
  quantizeTable(
    tableNames: ERecordKey[],
    callbacks: ((row: VolatileStorageMetadata<VersionedObject>) => VectorRow)[],
    outputName: QuantizedTableId,
  ): ResultAsync<QuantizedTable, PersistenceError | VectorDBError>;

  /*
    Returns kmeans instance of a quantized table
  */
  kmeans(
    tableName: QuantizedTableId,
    k: number,
  ): ResultAsync<KMeansResult, VectorDBError>;

  /*
    Returns an inference off of your Kmeans instance
  */
  infer(
    model: KMeansResult,
    userState: number[][],
  ): ResultAsync<InferenceResult, VectorDBError>;

  /*
    View all mappings of quantized instances
  */
  viewTables(): ResultAsync<Map<QuantizedTableId, QuantizedTable>, never>;
}

export const IVectorDBType = Symbol.for("IVectorDB");
