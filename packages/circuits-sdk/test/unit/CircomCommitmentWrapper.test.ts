/* import { CircomUtils, Identity } from "@snickerdoodlelabs/circuits";
import { BigNumberString, Commitment } from "@snickerdoodlelabs/objects";

import { CircomCommitmentWrapper } from "@circuits-sdk/implementations/circom/CircomCommitmentWrapper.js";

const signal =
  '{"consentContractId":"0x7e919252cd379Aef5f911Eae090fF6b4909b78C6","commitment":{"dataType":"bigint","value":"17470799417276826919889359284281809678769647185050195191869251295544615045713"}}';
const identityTrapdoor = BigNumberString(
  28552201314273890109164820853762517751858280901985112414193393904076172417962n.toString(),
);
const identityNullifier = BigNumberString(
  3096276089739499626852744551227832218988046107496929708072465965797400706090n.toString(),
);

class CircomCommitmentWrapperMocks {
  public commitment: Commitment;
  public constructor() {
    this.commitment = CircomUtils.getCommitment(
      identityTrapdoor,
      identityNullifier,
    );
  }
}

describe("CommitmentCircuitWrapper tests", () => {
  test("Generates Proof", async () => {
    // Arrange
    const mocks = new CircomCommitmentWrapperMocks();
    const Commitment = new CircomCommitmentWrapper();

    // Act
    const proofResult = await Commitment.prove(
      signal,
      identityTrapdoor,
      identityNullifier,
    );

    // Assert
    expect(proofResult).toBeDefined();
    expect(proofResult.isOk()).toBeTruthy();
  });

  test("Proof Validates", async () => {
    // Arrange
    const mocks = new CircomCommitmentWrapperMocks();
    const Commitment = new CircomCommitmentWrapper();

    // Act
    const result = await Commitment.prove(
      signal,
      identityTrapdoor,
      identityNullifier,
    ).andThen((proof) => {
      return Commitment.verify(signal, mocks.commitment, proof);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const valid = result._unsafeUnwrap();
    expect(valid).toBeTruthy();
  });
});
 */
