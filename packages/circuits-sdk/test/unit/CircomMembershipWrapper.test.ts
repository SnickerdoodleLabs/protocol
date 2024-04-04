import { CircomUtils } from "@snickerdoodlelabs/circuits";
import {
  BigNumberString,
  Commitment,
  IpfsCID,
  NullifierBNS,
  TrapdoorBNS,
} from "@snickerdoodlelabs/objects";

import { CircomMembershipWrapper } from "@circuits-sdk/implementations/circom/CircomMembershipWrapper.js";

const signal = "Phoebe";
const identityTrapdoor = TrapdoorBNS(1234567890n.toString());
const identityNullifier = NullifierBNS(9876543210n.toString());
const ipfsCID = IpfsCID("QmR5o49TZTxMcqAWq3eR45vzcduoSKq8Rnd5ZvWPeGi1B1");

function randomBigInt(): bigint {
  return BigInt(Math.floor(Math.random() * 1000000000));
}

class CircomMembershipWrapperMocks {
  public anonymitySet: Commitment[];
  public commitment: Commitment;
  public signalNullifier: NullifierBNS;

  public constructor(protected anonymitySetSize = 5) {
    this.commitment = CircomUtils.getCommitment(
      identityTrapdoor,
      identityNullifier,
    );
    this.anonymitySet = new Array<Commitment>();
    for (let i = 0; i < this.anonymitySetSize; i++) {
      this.anonymitySet.push(this.randomCommitment());
    }

    this.signalNullifier = CircomUtils.getSignalNullifier(
      identityNullifier,
      ipfsCID,
    );
  }

  public randomCommitment(): Commitment {
    return CircomUtils.getCommitment(
      TrapdoorBNS(randomBigInt().toString()),
      NullifierBNS(randomBigInt().toString()),
    );
  }
}

describe("CircomMembershipWrapper tests", () => {
  afterAll(async () => {
    // This is magic. Web workers are left open for the curve object so that it doesn't have to re-initialize.
    // But it messes with testing specifically, so we use this to kill it.
    // https://github.com/iden3/snarkjs/issues/152
    await globalThis.curve_bn128.terminate();
  });

  test("Generates Proof, anonymity set does not include identity", async () => {
    // Arrange
    const mocks = new CircomMembershipWrapperMocks();
    const membership = new CircomMembershipWrapper();

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
  });

  test("Generates Proof, anonymity set does include identity", async () => {
    // Arrange
    const mocks = new CircomMembershipWrapperMocks();
    const membership = new CircomMembershipWrapper();

    mocks.anonymitySet.push(mocks.commitment);

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
  });

  test("Proof Validates", async () => {
    // Arrange
    const mocks = new CircomMembershipWrapperMocks();
    const membership = new CircomMembershipWrapper();

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
  });
});
