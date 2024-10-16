import {
  Identity,
  Membership,
  MembershipWitness,
} from "@snickerdoodlelabs/circuits-o1js";
import {
  BigNumberString,
  CircuitError,
  Commitment,
  NullifierBNS,
  TrapdoorBNS,
  ZKProof,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { Encoding, Field, Keypair, MerkleTree, Poseidon } from "o1js";

import { CircuitUtils } from "@circuits-o1js-sdk/implementations/CircuitUtils.js";
import { CircuitWrapper } from "@circuits-o1js-sdk/implementations/CircuitWrapper.js";
import { IMembershipWrapper } from "@circuits-o1js-sdk/interfaces/IMembershipWrapper.js";

@injectable()
export class MembershipCircuitWrapper
  extends CircuitWrapper<Membership>
  implements IMembershipWrapper
{
  public constructor() {
    super(Membership);
  }

  static keypair: ResultAsync<Keypair, CircuitError> | null = null;

  static getIdentity(
    identityTrapdoor: TrapdoorBNS,
    identityNullifier: NullifierBNS,
  ): Identity {
    return new Identity({
      identityTrapdoor: CircuitUtils.bnsToField(identityTrapdoor),
      identityNullifier: CircuitUtils.bnsToField(identityNullifier),
    });
  }

  static getIdentityCommitment(identity: Identity): Commitment {
    return Commitment(identity.leaf().toBigInt());
  }

  static getSignalNullifier(
    identity: Identity,
    roundIdentifier: string,
  ): BigNumberString {
    return CircuitUtils.fieldToBNS(
      Poseidon.hash([
        identity.identityNullifier,
        Poseidon.hash(Encoding.stringToFields(roundIdentifier)),
      ]),
    );
  }

  public prove(
    signal: string,
    identityTrapdoor: TrapdoorBNS,
    identityNullifier: NullifierBNS,
    anonymitySet: Commitment[], // This is all the commitments of the identities in the anonymity set. If it includes the identity's commitment, we will fix it. If it doesn't include the identity's commitment, it will be added.
    roundIdentifier: string, // This is the epochNullifier, but is most likely to be the IPFS CID
  ): ResultAsync<ZKProof, CircuitError> {
    const signalFields = Encoding.stringToFields(signal);

    // NOTE: verifier should compute these quantities for themselves upon receiving the signal string
    const signalHash = Poseidon.hash(signalFields);
    const signalHashSquared = signalHash.mul(signalHash);

    // Create an identity object
    const identity = MembershipCircuitWrapper.getIdentity(
      identityTrapdoor,
      identityNullifier,
    );
    const identityCommitment =
      MembershipCircuitWrapper.getIdentityCommitment(identity);

    // Check if the anonymity set includes the identity's commitment
    if (!anonymitySet.includes(identityCommitment)) {
      anonymitySet.push(identityCommitment);
    }

    // Sort the anonymity set
    anonymitySet.sort();

    // Get the index of the user in the anonymity set
    const userIndex = anonymitySet.indexOf(identityCommitment);

    // Compress the anonymity group into a Merkle Tree object
    const identityTree = new MerkleTree(16); // MembershipWitness assumes tree w/ 2^16 leaves
    anonymitySet.forEach((commitment, index) => {
      identityTree.setLeaf(BigInt(index), new Field(commitment));
    });

    // Construct the identity's witness
    const w = identityTree.getWitness(BigInt(userIndex)); // calculate the witness for the first slot with your private data
    const witness = new MembershipWitness(w);

    // calculate the merkleRoot from the tree object
    const merkleRoot = identityTree.getRoot(); // Calculate your merkleRoot reference (this can be computed independently by anyone)

    // compute the signal nullifier from user's secret identityNullifier
    // FYI: the order of the array in the Poseidon hash matters
    const epochNullifier = Poseidon.hash(
      Encoding.stringToFields(roundIdentifier),
    );
    const signalNullifier = Poseidon.hash([
      new Field(identityNullifier),
      epochNullifier,
    ]);

    return this._prove(
      [identity, witness],
      [
        merkleRoot,
        epochNullifier,
        signalNullifier,
        signalHash,
        signalHashSquared,
      ],
    );
  }

  public verify(
    signal: string,
    anonymitySet: Commitment[], // This is all the commitments of the identities in the anonymity set.
    roundIdentifier: string, // This is the epochNullifier, but is most likely to be the IPFS CID
    signalNullifier: NullifierBNS,
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    const signalFields = Encoding.stringToFields(signal);

    const signalHash = Poseidon.hash(signalFields);
    const signalHashSquared = signalHash.mul(signalHash);

    // Sort the anonymity set
    anonymitySet.sort();

    // Compress the anonymity group into a Merkle Tree object
    const identityTree = new MerkleTree(16); // MembershipWitness assumes tree w/ 2^16 leaves
    anonymitySet.forEach((commitment, index) => {
      identityTree.setLeaf(BigInt(index), new Field(commitment));
    });

    // calculate the merkleRoot from the tree object
    const merkleRoot: Field = identityTree.getRoot(); // Calculate your merkleRoot reference (this can be computed independently by anyone)

    // compute the signal nullifier from user's secret identityNullifier
    // FYI: the order of the array in the Poseidon hash matters
    const epochNullifier = Poseidon.hash(
      Encoding.stringToFields(roundIdentifier),
    );

    return this._verify(
      [
        merkleRoot,
        epochNullifier,
        new Field(signalNullifier),
        signalHash,
        signalHashSquared,
      ],
      proof,
    );
  }

  protected getKeypairResult(): ResultAsync<Keypair, CircuitError> | null {
    return MembershipCircuitWrapper.keypair;
  }
  protected setKeypairResult(result: ResultAsync<Keypair, CircuitError>): void {
    MembershipCircuitWrapper.keypair = result;
  }
}
