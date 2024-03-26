import { Identity } from "@snickerdoodlelabs/circuits";
import {
  BigNumberString,
  Commitment,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { Field } from "o1js";

import { MembershipWrapper } from "@circuits-sdk/MembershipWrapper.js";

const signal = "Phoebe";
const identityTrapdoor = BigNumberString(1234567890n.toString());
const identityNullifier = BigNumberString(9876543210n.toString());
const ipfsCID = IpfsCID("QmR5o49TZTxMcqAWq3eR45vzcduoSKq8Rnd5ZvWPeGi1B1");

class MembershipWrapperMocks {
  public anonymitySet: Commitment[];
  public identity: Identity;
  public signalNullifier: BigNumberString;

  public constructor(protected anonymitySetSize = 5) {
    this.identity = MembershipWrapper.getIdentity(
      identityTrapdoor,
      identityNullifier,
    );
    this.anonymitySet = new Array<Commitment>();
    for (let i = 0; i < this.anonymitySetSize; i++) {
      this.anonymitySet.push(
        MembershipWrapper.getIdentityCommitment(this.randomIdentity()),
      );
    }

    this.signalNullifier = MembershipWrapper.getSignalNullifier(
      this.identity,
      ipfsCID,
    );
  }

  public randomIdentity(): Identity {
    return new Identity({
      identityTrapdoor: Field.random(),
      identityNullifier: Field.random(),
    });
  }
}

describe("MembershipWrapper tests", () => {
  test("Generates Proof, anonymity set does not include identity", async () => {
    // Arrange
    const mocks = new MembershipWrapperMocks();
    const membership = new MembershipWrapper();

    // Act
    const proofResult = await membership.prove(
      signal,
      identityTrapdoor,
      identityNullifier,
      mocks.anonymitySet,
      ipfsCID,
    );

    // Assert
    expect(proofResult).toBeDefined();
    expect(proofResult.isOk()).toBeTruthy();
  }, 40000);

  test("Generates Proof, anonymity set does not include identity", async () => {
    // Arrange
    const mocks = new MembershipWrapperMocks();
    const membership = new MembershipWrapper();

    mocks.anonymitySet.push(
      MembershipWrapper.getIdentityCommitment(mocks.identity),
    );

    // Act
    const proofResult = await membership.prove(
      signal,
      identityTrapdoor,
      identityNullifier,
      mocks.anonymitySet,
      ipfsCID,
    );

    // Assert
    expect(proofResult).toBeDefined();
    expect(proofResult.isOk()).toBeTruthy();
  }, 40000);

  test("Proof Validates", async () => {
    // Arrange
    const mocks = new MembershipWrapperMocks();
    const membership = new MembershipWrapper();

    // Act
    const result = await membership
      .prove(
        signal,
        identityTrapdoor,
        identityNullifier,
        mocks.anonymitySet,
        ipfsCID,
      )
      .andThen((proof) => {
        return membership.verify(
          signal,
          mocks.anonymitySet,
          ipfsCID,
          mocks.signalNullifier,
          proof,
        );
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const valid = result._unsafeUnwrap();
    expect(valid).toBeTruthy();
  }, 40000);
});
