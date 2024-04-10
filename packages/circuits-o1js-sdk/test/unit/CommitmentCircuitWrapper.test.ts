import { Identity } from "@snickerdoodlelabs/circuits-o1js";
import { NullifierBNS, TrapdoorBNS } from "@snickerdoodlelabs/objects";

import { CommitmentCircuitWrapper } from "@circuits-o1js-sdk/implementations/CommitmentCircuitWrapper.js";

const signal =
  '{"consentContractId":"0x7e919252cd379Aef5f911Eae090fF6b4909b78C6","commitment":{"dataType":"bigint","value":"17470799417276826919889359284281809678769647185050195191869251295544615045713"}}';
const identityTrapdoor = TrapdoorBNS(
  28552201314273890109164820853762517751858280901985112414193393904076172417962n.toString(),
);
const identityNullifier = NullifierBNS(
  3096276089739499626852744551227832218988046107496929708072465965797400706090n.toString(),
);

class CommitmentWrapperMocks {
  public identity: Identity;

  public constructor() {
    this.identity = CommitmentCircuitWrapper.getIdentity(
      identityTrapdoor,
      identityNullifier,
    );
  }
}

describe("CommitmentCircuitWrapper tests", () => {
  test("Generates Proof", async () => {
    // Arrange
    const mocks = new CommitmentWrapperMocks();
    const Commitment = new CommitmentCircuitWrapper();

    // Act
    const proofResult = await Commitment.prove(
      signal,
      identityTrapdoor,
      identityNullifier,
    );

    // Assert
    expect(proofResult).toBeDefined();
    expect(proofResult.isOk()).toBeTruthy();
  }, 40000);

  test("Proof Validates", async () => {
    // Arrange
    const mocks = new CommitmentWrapperMocks();
    const Commitment = new CommitmentCircuitWrapper();

    // Act
    const result = await Commitment.prove(
      signal,
      identityTrapdoor,
      identityNullifier,
    ).andThen((proof) => {
      return Commitment.verify(
        signal,
        CommitmentCircuitWrapper.getIdentityCommitment(mocks.identity),
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
