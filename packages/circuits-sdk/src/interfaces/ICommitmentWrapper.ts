import {
  CircuitError,
  Commitment,
  NullifierBNS,
  TrapdoorBNS,
  ZKProof,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICommitmentWrapper {
  /**
   * asdf
   * @param signal a string representing the signal to be proved
   * @param identityTrapdoor A BigNumberString representing one half of the private data for an Identity
   * @param identityNullifier A BigNumberString representing the other half of the private data for an Identity
   */
  prove(
    signal: string,
    identityTrapdoor: TrapdoorBNS,
    identityNullifier: NullifierBNS,
  ): ResultAsync<ZKProof, CircuitError>;

  /**
   * Returns true if the proof is valid, false otherwise. All the public data (non-proof parameters) must match
   * what was used to generate the proof. Since this method is normally called on the server, all the values
   * must be passed along over the wire in addition to the proof, or be stored on a 3rd party such as the
   * blockchain. The anonymity set is a good candidate for this.
   * @param signal a string representing the signal to be proved
   * @param proof The ZKProof that is generated from the prove method. This proof is the ObjectUtils.serialize()'d version of the o1js Proof object.
   */
  verify(
    signal: string,
    commitment: Commitment,
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError>;

  /**
   * Initiates the loading of cryptographic resources (WASM and zkey files) needed for the zk operations.
   * Method sets up asynchronous loaders to fetch and process these files and caches the results
   * as promises within the class instance.
   *
   * This method should be called early in the application's lifecycle
   */
  preFetch(): ResultAsync<undefined, never>;
}

export const ICommitmentWrapperType = Symbol.for("ICommitmentWrapper");
