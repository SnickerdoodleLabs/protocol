import { ResultAsync } from "neverthrow";

export interface ICircomWrapper {
  /**
   * Initiates the loading of cryptographic resources (WASM and zkey files) needed for the zk operations.
   * Method sets up asynchronous loaders to fetch and process these files and caches the results
   * as promises within the class instance.
   *
   * This method should be called early in the application's lifecycle
   */
  preFetch(): ResultAsync<undefined, never>;
}

export const ICircomWrapperType = Symbol.for("ICircomWrapper");
