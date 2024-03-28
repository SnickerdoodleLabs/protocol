pragma circom 2.1.5;

include "poseidon.circom";
include "binary-merkle-root.circom";

// This is a slightly modified version of the Semaphore circuit
//https://github.com/semaphore-protocol/semaphore/blob/main/packages/circuits/semaphore.circom
template Semaphore(MAX_DEPTH) {
    // Input signals.
    // The input signals are all private except 'message' and 'scope'.
    signal input identityTrapdoor;
    signal input identityNullifier;
    signal input merkleProofLength, merkleProofIndices[MAX_DEPTH], merkleProofSiblings[MAX_DEPTH];
    signal input message;
    signal input scope;

    // Output signals.
    // The output signals are all public.
    signal output merkleRoot, nullifier;

    var identityCommitment = Poseidon(2)([identityTrapdoor, identityNullifier]);

    // Proof of membership verification.
    // The Merkle root passed as output must be equal to that calculated within
    // the circuit through the inputs of the Merkle proof.
    // See https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/circuits/circom/binary-merkle-root.circom
    // to know more about how the 'BinaryMerkleRoot' template works.
    merkleRoot <== BinaryMerkleRoot(MAX_DEPTH)(identityCommitment, merkleProofLength, merkleProofIndices, merkleProofSiblings);

    // Nullifier generation.
    // The nullifier is a value that essentially identifies the proof generated in a specific scope
    // and by a specific identity, so that externally anyone can check if another proof with the same
    // nullifier has already been generated. This mechanism can be particularly useful in cases
    // where one wants to prevent double-spending or double-voting, for example.
    nullifier <== Poseidon(2)([scope, identityNullifier]);

    // The message is not really used within the circuit.
    // The square applied to it is a way to force Circom's compiler to add a constraint and
    // prevent its value from being changed by an attacker.
    // More information here: https://geometry.xyz/notebook/groth16-malleability.
    signal dummySquare <== message * message;
}


component main = Semaphore(16);