import {
  IIndexedDB,
  PersistenceError,
  ERecordKey,
  VersionedObject,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { ResultAsync } from "neverthrow";

import { InferenceResult } from "@vector-db/objects/index.js";

export interface IQuantizationService {
  initialize(template?: IIndexedDB): ResultAsync<IIndexedDB, PersistenceError>;
  table<T extends VersionedObject>(
    name: string,
  ): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError>;

  quantizeTable(
    tableName: ERecordKey,
    callback: (n: any) => any,
  ): ResultAsync<number[][], PersistenceError>;

  // Compute the K - clusters
  kmeans(
    quantizedTable: number[][],
    k: number,
  ): ResultAsync<KMeansResult, PersistenceError>;

  infer(
    model: KMeansResult,
    userState: number[][],
  ): ResultAsync<InferenceResult, PersistenceError>;
}

export const IQuantizationServiceType = Symbol.for("IQuantizationService");
