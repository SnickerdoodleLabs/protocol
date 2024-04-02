/* import { Commitment, Identity } from "@snickerdoodlelabs/circuits";
import {
  BigNumberString,
  CircuitError,
  ZKProof,
  Commitment as CommitmentBrand,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { Encoding, Field, Keypair, Poseidon } from "o1js";

import { CircuitWrapper } from "@circuits-sdk/implementations/CircuitWrapper.js";
import { ICommitmentWrapper } from "@circuits-sdk/interfaces/ICommitmentWrapper.js";

@injectable()
export class CommitmentCircuitWrapper
  extends CircuitWrapper<Commitment>
  implements ICommitmentWrapper
{
  public constructor() {
    super(Commitment);
  }

  static keypair: ResultAsync<Keypair, CircuitError> | null = null;

  static getIdentity(
    identityTrapdoor: BigNumberString,
    identityNullifier: BigNumberString,
  ): Identity {
    return new Identity({
      identityTrapdoor: new Field(BigInt(identityTrapdoor)),
      identityNullifier: new Field(BigInt(identityNullifier)),
    });
  }

  static getIdentityCommitment(identity: Identity): CommitmentBrand {
    return CommitmentBrand(identity.leaf().toBigInt());
  }

  static getSignalNullifier(
    identity: Identity,
    roundIdentifier: string,
  ): BigNumberString {
    return BigNumberString(
      Poseidon.hash([
        identity.identityNullifier,
        Poseidon.hash(Encoding.stringToFields(roundIdentifier)),
      ])
        .toBigInt()
        .toString(),
    );
  }

  public prove(
    signal: string,
    identityTrapdoor: BigNumberString,
    identityNullifier: BigNumberString,
  ): ResultAsync<ZKProof, CircuitError> {
    const signalFields = Encoding.stringToFields(signal);

    // NOTE: verifier should compute these quantities for themselves upon receiving the signal string
    const signalHash = Poseidon.hash([...signalFields]);
    const signalHashSquared = signalHash.mul(signalHash);

    // Create an identity object
    const identity = CommitmentCircuitWrapper.getIdentity(
      identityTrapdoor,
      identityNullifier,
    );
    const identityCommitment =
      CommitmentCircuitWrapper.getIdentityCommitment(identity);

    return this._prove(
      [identity],
      [new Field(identityCommitment), signalHash, signalHashSquared],
    );
  }

  public verify(
    signal: string,
    commitment: CommitmentBrand,
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    const signalFields = Encoding.stringToFields(signal);

    const signalHash = Poseidon.hash(signalFields);
    const signalHashSquared = signalHash.mul(signalHash);

    return this._verify(
      [new Field(commitment), signalHash, signalHashSquared],
      proof,
    );
  }

  protected getKeypairResult(): ResultAsync<Keypair, CircuitError> | null {
    return CommitmentCircuitWrapper.keypair;
  }
  protected setKeypairResult(result: ResultAsync<Keypair, CircuitError>): void {
    CommitmentCircuitWrapper.keypair = result;
  }
}
 */
