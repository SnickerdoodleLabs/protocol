import "reflect-metadata";
import { CircomUtils } from "@snickerdoodlelabs/circuits";
import { commitmentCode } from "@snickerdoodlelabs/circuits/src/commitment/commitment.wasm.js";
import { commitmentZKey } from "@snickerdoodlelabs/circuits/src/commitment/commitment.zkey.js";
import { semaphoreCode } from "@snickerdoodlelabs/circuits/src/semaphore/semaphore.wasm.js";
import { semaphoreZKey } from "@snickerdoodlelabs/circuits/src/semaphore/semaphore.zkey.js";
import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  Commitment,
  NullifierBNS,
  TrapdoorBNS,
  URLString,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import * as td from "testdouble";

import { ICircutsSDKConfigProvider } from "@circuits-sdk/ICircutsSDKConfigProvider";
import { CircomCommitmentWrapper } from "@circuits-sdk/implementations/CircomCommitmentWrapper.js";

const signal =
  '{"consentContractId":"0x7e919252cd379Aef5f911Eae090fF6b4909b78C6","commitment":{"dataType":"bigint","value":"17470799417276826919889359284281809678769647185050195191869251295544615045713"}}';
const identityTrapdoor = TrapdoorBNS(
  28552201314273890109164820853762517751858280901985112414193393904076172417962n.toString(),
);
const identityNullifier = NullifierBNS(
  3096276089739499626852744551227832218988046107496929708072465965797400706090n.toString(),
);

class CircomCommitmentWrapperMocks {
  public commitment: Commitment;
  public ajaxUtils: IAxiosAjaxUtils;
  public configProvider: ICircutsSDKConfigProvider;
  public constructor() {
    this.ajaxUtils = td.object<IAxiosAjaxUtils>();
    this.configProvider = td.object<ICircutsSDKConfigProvider>();
    td.when(this.ajaxUtils.get(td.matchers.anything())).thenDo((url: URL) => {
      const mockData = new Map<string, Uint8Array>([
        ["QmT5avnPx18LMdbzbHgVHJrkzUgwt7sFMoqhEHYBukF6eP", commitmentCode],
        ["QmesxcQYvng3crv34r557WiFTdnvGH3uzvxVRCcaftZWxa", commitmentZKey],
        ["QmUSxnC3YNkH92HNkzqYxAWV2T8uioe2Uxm4Zfa7NbJNHs", semaphoreCode],
        ["QmUk9mbuHQEir1uWMGweLdTVhGNVpxf4KrnkGj9Xwnhfbc", semaphoreZKey],
      ]);

      const key = url.pathname.split("/").pop();
      if (key != null) {
        return okAsync(mockData.get(key));
      }
      return errAsync(
        new AjaxError("Invalid hash at CommitmentCircuitWrapper tests", 500),
      );
    });

    td.when(this.configProvider.getConfig()).thenReturn(
      okAsync({ ipfsFetchBaseUrl: URLString("http://sd/ipfs") }),
    );

    this.commitment = CircomUtils.getCommitment(
      identityTrapdoor,
      identityNullifier,
    );
  }

  public factory(): CircomCommitmentWrapper {
    return new CircomCommitmentWrapper(this.ajaxUtils, this.configProvider);
  }
}

describe("CommitmentCircuitWrapper tests", () => {
  test("Generates Proof", async () => {
    // Arrange
    const mocks = new CircomCommitmentWrapperMocks();
    const Commitment = mocks.factory();
    await Commitment.preFetch();
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
    const Commitment = mocks.factory();
    await Commitment.preFetch();
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
