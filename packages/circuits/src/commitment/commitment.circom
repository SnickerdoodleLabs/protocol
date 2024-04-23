pragma circom 2.1.5;

include "poseidon.circom";

// This is a slightly modified version of the Semaphore circuit to only confirm the commitment is valid for Semaphore
template Commitment() {
    // Input signals.
    // The input signals are all private except 'message' and 'commitment'.
    signal input identityTrapdoor;
    signal input identityNullifier;
    signal input message;

    signal output commitment, messageSquare;

    var identityCommitment = Poseidon(2)([identityTrapdoor, identityNullifier]);

    // Confirm that the commitment is constructed correctly.
    commitment <== identityCommitment;

    // The message is not really used within the circuit.
    // The square applied to it is a way to force Circom's compiler to add a constraint and
    // prevent its value from being changed by an attacker.
    // More information here: https://geometry.xyz/notebook/groth16-malleability.
    messageSquare <== message * message;
}


component main = Commitment();