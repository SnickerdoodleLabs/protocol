![Core](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Circuits

This package implements various zero-knowledge circuits for the Snickerdoodle protocol. The circuits are writtin in O1js, a typescript-native zk-circuit library from
O1Labs. 

## Zero-Knowledge Proof of Membership

The primary circuit in the Snickerdoodle circuits package calculates [proof of membership](/packages/circuits/src/membership.ts) with response deduplication and was inspired by the [Semaphore](https://docs.semaphore.pse.dev/) project. This circuit takes in a reasonably large anonymity 
set and uses a Merkle tree inclusion proof (calculated with the Poseidon hash function) to prove that a user belongs to set. The anonymity set 
is nominally written to a public blockchain network so that an end-user client can fetch it without the need of a proprietary third-party data 
provider. 

Each member of the anonymity set commits to two secret [identity](/packages/circuits/src/membership.ts#L13) values: a *trapdoor* value and 
an *identity nullifier* value. It is this commitment that is written to the blockchain by each participant. The nullifier value is used in 
conjunction with the IPFS CID value corresponding to an SDQL query that the user's core instance is responding to. The hash of the concatenation 
of the identity nullifier with the IPFS CID results in a public *response nullifier* that allows for deduplication of responses without the need 
for a centralized coordinator. 

Lastly, the circuit computes the square of the Poseidon hash of the response data so that the verifier can ensure that the payload was not modified 
after being sent over the wire. 