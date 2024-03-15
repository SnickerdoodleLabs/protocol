import { Identity } from "@snickerdoodlelabs/circuits";
import { BigNumberString } from "@snickerdoodlelabs/objects";
import { Field } from "o1js";

import { CommitmentWrapper } from "@circuits-sdk/CommitmentWrapper.js";

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

  public constructor(protected anonymitySetSize = 5) {
    this.identity = CommitmentWrapper.getIdentity(
      identityTrapdoor,
      identityNullifier,
    );
  }

  public randomIdentity(): Identity {
    return new Identity({
      identityTrapdoor: Field.random(),
      identityNullifier: Field.random(),
    });
  }
}

describe("CommitmentWrapper tests", () => {
  test("Generates Proof", async () => {
    // Arrange
    const mocks = new CommitmentWrapperMocks();
    const Commitment = new CommitmentWrapper();

    // Act
    const proofResult = await Commitment.prove(
      signal,
      identityTrapdoor,
      identityNullifier,
    );

    // Assert
    expect(proofResult).toBeDefined();
    const err = proofResult._unsafeUnwrapErr();
    console.log(err);
    expect(proofResult.isOk()).toBeTruthy();
  }, 20000);

  // test("Proof Validates", async () => {
  //   // Arrange
  //   const mocks = new CommitmentWrapperMocks();
  //   const Commitment = new CommitmentWrapper();

  //   // Act
  //   const result = await Commitment.prove(
  //     signal,
  //     identityTrapdoor,
  //     identityNullifier,
  //     mocks.anonymitySet,
  //     ipfsCID,
  //   ).andThen((proof) => {
  //     return Commitment.verify(
  //       signal,
  //       mocks.anonymitySet,
  //       ipfsCID,
  //       mocks.signalNullifier,
  //       proof,
  //     );
  //   });

  //   // Assert
  //   expect(result).toBeDefined();
  //   expect(result.isOk()).toBeTruthy();
  //   const valid = result._unsafeUnwrap();
  //   expect(valid).toBeTruthy();
  // }, 20000);
});
