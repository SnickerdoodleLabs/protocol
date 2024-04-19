import {
  CircomUtils,
  ICircomCommitmentInputs,
  ICircomCommitmentVerificationInputs,
  commitmentVerificationKey,
  factoryCircomCommitmentVerificationInputs,
} from "@snickerdoodlelabs/circuits";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  Commitment,
  ZKProof,
  CircuitError,
  NullifierBNS,
  TrapdoorBNS,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import { ICircutsSDKConfig } from "@circuits-sdk/ICircutsSDKConfig.js";
import {
  ICircutsSDKConfigProvider,
  ICircutsSDKConfigProviderype,
} from "@circuits-sdk/ICircutsSDKConfigProvider.js";
import { CircomWrapper } from "@circuits-sdk/implementations/circom/CircomWrapper.js";
import { ICommitmentWrapper } from "@circuits-sdk/interfaces/index.js";
@injectable()
export class CircomCommitmentWrapper
  extends CircomWrapper<
    ICircomCommitmentInputs,
    ICircomCommitmentVerificationInputs
  >
  implements ICommitmentWrapper
{
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ICircutsSDKConfigProviderype)
    protected circutsSDKConfig: ICircutsSDKConfigProvider,
  ) {
    super(
      ajaxUtils,
      circutsSDKConfig,
      commitmentVerificationKey,
      IpfsCID("QmT5avnPx18LMdbzbHgVHJrkzUgwt7sFMoqhEHYBukF6eP"),
      IpfsCID("QmesxcQYvng3crv34r557WiFTdnvGH3uzvxVRCcaftZWxa"),
    );
  }

  public prove(
    signal: string,
    identityTrapdoor: TrapdoorBNS,
    identityNullifier: NullifierBNS,
  ): ResultAsync<ZKProof, CircuitError> {
    const signalHash = CircomUtils.stringToPoseidonHash(signal);

    const INPUT: ICircomCommitmentInputs = {
      identityTrapdoor: BigInt(identityTrapdoor),
      identityNullifier: BigInt(identityNullifier),
      message: signalHash,
    };

    return this._prove(INPUT);
  }

  public verify(
    signal: string,
    commitment: Commitment,
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    const inputs = factoryCircomCommitmentVerificationInputs(
      commitment,
      signal,
    );
    return this._verify(proof, inputs);
  }
}
