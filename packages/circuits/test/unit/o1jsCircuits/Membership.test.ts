// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
// import { BigNumberString, Commitment } from "@snickerdoodlelabs/objects";
// import { Poseidon, Field, MerkleTree, Encoding } from "o1js";

// import { Identity } from "@circuits/o1jsCircuits/Identity.js";
// import { Membership, MembershipWitness } from "@circuits/o1jsCircuits/Membership.js";

// class MembershipMocks {
//   static generateIdentities(count: number): Identity[] {
//     const identities = new Array<Identity>();

//     for (let i = 0; i < count; i++) {
//       identities.push(
//         new Identity({
//           identityTrapdoor: Field.random(),
//           identityNullifier: Field.random(),
//         }),
//       );
//     }
//     return identities;
//   }
// }

// describe("Proof of Membership", () => {
//   test("Generate Proof of Membership", async () => {
//     // pretend like we're fetching info from the blockchain to construct our anonymity group
//     type Names = "Bob" | "Alice" | "Charlie" | "Olivia";
//     const Identities = new Map<Names, Identity>(
//       ["Bob", "Alice", "Charlie", "Olivia"].map(
//         (name: string, index: number) => {
//           return [
//             name as Names,
//             new Identity({
//               identityTrapdoor: Field.random(), // secret value
//               identityNullifier: Field.random(), // another secret value
//             }),
//           ];
//         },
//       ),
//     );

//     // construct a fake signal, just make it an arbitrary string
//     const signal = "Here is my signal string.";

//     // then convert the string to an array of Field elements appropriate for Poseidon hashing
//     const signalFields = Encoding.stringToFields(signal);

//     // NOTE: verifier should compute these quantities for themselves upon receiving the signal string
//     const signalHash = Poseidon.hash([...signalFields]);
//     const signalHashSquared = signalHash.mul(signalHash);

//     // Compress the anonymity group into a Merkle Tree object
//     const identityTree = new MerkleTree(16); // MembershipWitness assumes tree w/ 2^16 leaves
//     identityTree.setLeaf(0n, Identities.get("Bob")!.leaf());
//     identityTree.setLeaf(1n, Identities.get("Alice")!.leaf());
//     identityTree.setLeaf(2n, Identities.get("Charlie")!.leaf());
//     identityTree.setLeaf(3n, Identities.get("Olivia")!.leaf());

//     // calculate the merkleRoot from the tree object
//     const merkleRoot: Field = identityTree.getRoot(); // Calculate your merkleRoot reference (this can be computed independently by anyone)

//     // construct the private witness object for Bob
//     const userIndex = 0n;
//     const userIdentity = Identities.get("Bob")!;
//     const w = identityTree.getWitness(userIndex); // calculate the witness for the first slot with your private data
//     const witness = new MembershipWitness(w);

//     // compute the signal nullifier from user's secret identityNullifier
//     // FYI: the order of the array in the Poseidon hash matters
//     const epochNullifier: Field = Field.random();
//     const signalNullifier: Field = Poseidon.hash([
//       userIdentity.identityNullifier,
//       epochNullifier,
//     ]);

//     // for a given static circuit, proving keys must be generated once-for-all
//     console.time("generating keypair...");
//     const kp = await Membership.generateKeypair(); // needed to generate circuit proof
//     console.timeEnd("generating keypair...");

//     const vk = kp.verificationKey(); // needed to verify circuit proof

//     // NOTE: this step would happen client-side
//     console.log("prove...");
//     console.time("prove...");
//     // inputs are: [private input array], [public input array], keypair from .generateKeypair()
//     const proof = await Membership.prove(
//       [userIdentity, witness],
//       [
//         merkleRoot,
//         epochNullifier,
//         signalNullifier,
//         signalHash,
//         signalHashSquared,
//       ],
//       kp,
//     );
//     console.timeEnd("prove...");

//     const serializedProof = ObjectUtils.serialize(proof);

//     // NOTE: this step would happen server-side
//     console.log("verify...");
//     console.time("verify...");
//     // inputs are: [public input array], verification key, proof generated by calling .prove()
//     const ok = await Membership.verify(
//       [
//         merkleRoot,
//         epochNullifier,
//         signalNullifier,
//         signalHash,
//         signalHashSquared,
//       ],
//       vk,
//       ObjectUtils.deserialize(serializedProof),
//     );
//     console.timeEnd("verify...");

//     expect(ok).toBe(true);
//   }, 20000);

//   test("Generate Proof of Membership Via Commitments", async () => {
//     // pretend like we're fetching info from the blockchain to construct our anonymity group
//     const identities = MembershipMocks.generateIdentities(4);

//     // construct a fake signal, just make it an arbitrary string
//     const signal = "Here is my signal string.";

//     // then convert the string to an array of Field elements appropriate for Poseidon hashing
//     const signalFields = Encoding.stringToFields(signal);

//     // NOTE: verifier should compute these quantities for themselves upon receiving the signal string
//     const signalHash = Poseidon.hash([...signalFields]);
//     const signalHashSquared = signalHash.mul(signalHash);

//     // Compress the anonymity group into a Merkle Tree object
//     const identityTree = new MerkleTree(16); // MembershipWitness assumes tree w/ 2^16 leaves
//     identities.forEach((identity, index) => {
//       identityTree.setLeaf(BigInt(index), identity.leaf());
//     });

//     // calculate the merkleRoot from the tree object
//     const merkleRoot: Field = identityTree.getRoot(); // Calculate your merkleRoot reference (this can be computed independently by anyone)

//     // construct the private witness object for Bob
//     const userIndex = 0n;
//     const userIdentity = identities[0];
//     const w = identityTree.getWitness(userIndex); // calculate the witness for the first slot with your private data
//     const witness = new MembershipWitness(w);

//     // compute the signal nullifier from user's secret identityNullifier
//     // FYI: the order of the array in the Poseidon hash matters
//     const epochNullifier = Poseidon.hash(
//       Encoding.stringToFields("epochNullifier"),
//     );
//     const signalNullifier = Poseidon.hash([
//       userIdentity.identityNullifier,
//       epochNullifier,
//     ]);

//     // for a given static circuit, proving keys must be generated once-for-all
//     console.time("generating keypair...");
//     const kp = await Membership.generateKeypair(); // needed to generate circuit proof
//     console.timeEnd("generating keypair...");

//     const vk = kp.verificationKey(); // needed to verify circuit proof

//     // NOTE: this step would happen client-side
//     console.log("prove...");
//     console.time("prove...");
//     // inputs are: [private input array], [public input array], keypair from .generateKeypair()
//     const proof = await Membership.prove(
//       [userIdentity, witness],
//       [
//         merkleRoot,
//         epochNullifier,
//         signalNullifier,
//         signalHash,
//         signalHashSquared,
//       ],
//       kp,
//     );
//     console.timeEnd("prove...");

//     const serializedProof = ObjectUtils.serialize(proof);

//     // NOTE: this step would happen server-side
//     console.log("verify...");
//     console.time("verify...");
//     // inputs are: [public input array], verification key, proof generated by calling .prove()
//     const ok = await Membership.verify(
//       [
//         merkleRoot,
//         epochNullifier,
//         signalNullifier,
//         signalHash,
//         signalHashSquared,
//       ],
//       vk,
//       ObjectUtils.deserialize(serializedProof),
//     );
//     console.timeEnd("verify...");

//     expect(ok).toBe(true);
//   }, 20000);

//   test("Identity Commitment can be serialized", async () => {
//     // Arrange
//     const trapdoor = BigNumberString("1");
//     const nullifier = BigNumberString("2");

//     const identity = new Identity({
//       identityTrapdoor: new Field(BigInt(trapdoor)),
//       identityNullifier: new Field(BigInt(nullifier)),
//     });

//     const commitment = identity.leaf();
//     console.log("Commitment: ", commitment.toString());
//     // Act
//     const serializedCommitment = Commitment(commitment.toBigInt());

//     console.log(serializedCommitment);

//     const deserializedCommitment = new Field(serializedCommitment);

//     // Assert
//     expect(commitment.toBigInt()).toBe(deserializedCommitment.toBigInt());
//   });
// });
