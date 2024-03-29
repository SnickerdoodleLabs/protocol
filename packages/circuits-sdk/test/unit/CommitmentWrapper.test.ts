import { Identity } from "@snickerdoodlelabs/circuits";
import { BigNumberString } from "@snickerdoodlelabs/objects";
import { Field } from "o1js";

import { CommitmentWrapper } from "@circuits-sdk/implementations/CommitmentWrapper.js";

const signal =
  '{"consentContractId":"0x7e919252cd379Aef5f911Eae090fF6b4909b78C6","commitment":{"dataType":"bigint","value":"17470799417276826919889359284281809678769647185050195191869251295544615045713"}}';
const identityTrapdoor = BigNumberString(
  28552201314273890109164820853762517751858280901985112414193393904076172417962n.toString(),
);
const identityNullifier = BigNumberString(
  3096276089739499626852744551227832218988046107496929708072465965797400706090n.toString(),
);

class CommitmentWrapperMocks {
  public identity: Identity;

  public constructor() {
    this.identity = CommitmentWrapper.getIdentity(
      identityTrapdoor,
      identityNullifier,
    );
  }

  static generateIdentities(count: number): Identity[] {
    const identities = new Array<Identity>();

    for (let i = 0; i < count; i++) {
      identities.push(
        new Identity({
          identityTrapdoor: Field.random(),
          identityNullifier: Field.random(),
        }),
      );
    }
    return identities;
  }
}

describe("CommitmentWrapper tests", () => {
  test("Generates Proof", async () => {
    // Arrange
    const mocks = new CommitmentWrapperMocks();
    const wrapper = new CommitmentWrapper();

    // Act
    const proofResult = await wrapper.prove(
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
    const commitment = new CommitmentWrapper();

    // Act
    const result = await commitment
      .prove(signal, identityTrapdoor, identityNullifier)
      .andThen((proof) => {
        return commitment.verify(
          signal,
          CommitmentWrapper.getIdentityCommitment(mocks.identity),
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
