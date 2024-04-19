import {
  CircomUtils,
  ICircomSemaphoreInputs,
  ICircomSemaphoreVerificationInputs,
  factoryCircomSemaphoreVerificationInputs,
  semaphoreVerificationKey,
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
import { LeanIMT } from "@zk-kit/imt";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";
import { poseidon2 } from "poseidon-lite";

import {
  ICircutsSDKConfigProvider,
  ICircutsSDKConfigProviderype,
} from "@circuits-sdk/ICircutsSDKConfigProvider.js";
import { CircomWrapper } from "@circuits-sdk/implementations/circom/CircomWrapper.js";
import { IMembershipWrapper } from "@circuits-sdk/interfaces/index.js";

@injectable()
export class CircomMembershipWrapper
  extends CircomWrapper<
    ICircomSemaphoreInputs,
    ICircomSemaphoreVerificationInputs
  >
  implements IMembershipWrapper
{
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ICircutsSDKConfigProviderype)
    protected circutsSDKConfig: ICircutsSDKConfigProvider,
  ) {
    super(
      ajaxUtils,
      circutsSDKConfig,
      semaphoreVerificationKey,
      IpfsCID("QmUSxnC3YNkH92HNkzqYxAWV2T8uioe2Uxm4Zfa7NbJNHs"),
      IpfsCID("QmUk9mbuHQEir1uWMGweLdTVhGNVpxf4KrnkGj9Xwnhfbc"),
    );
  }

  public MAX_DEPTH = 16;

  public prove(
    signal: string,
    identityTrapdoor: TrapdoorBNS,
    identityNullifier: NullifierBNS,
    anonymitySet: Commitment[],
    roundIdentifier: string,
  ): ResultAsync<ZKProof, CircuitError> {
    const signalHash = CircomUtils.stringToPoseidonHash(signal);

    const commitment = CircomUtils.getCommitment(
      identityTrapdoor,
      identityNullifier,
    );

    const tree = new LeanIMT((a, b) => poseidon2([a, b]));

    // Check if the anonymity set includes the identity's commitment
    if (!anonymitySet.includes(commitment)) {
      anonymitySet.push(commitment);
    }

    // Sort the anonymity set
    anonymitySet.sort();

    let myCommitmentIndex = 0;
    anonymitySet.forEach((anonymitySetEntry, index) => {
      tree.insert(anonymitySetEntry);
      if (anonymitySetEntry == commitment) {
        myCommitmentIndex = index;
      }
    });

    const { siblings: merkleProofSiblings, index } =
      tree.generateProof(myCommitmentIndex);

    // The index must be converted to a list of indices, 1 for each tree level.
    // The circuit tree depth is 20, so the number of siblings must be 20, even if
    // the tree depth is actually 3. The missing siblings can be set to 0, as they
    // won't be used to calculate the root in the circuit.
    const merkleProofIndices: number[] = [];

    for (let i = 0; i < this.MAX_DEPTH; i += 1) {
      merkleProofIndices.push((index >> i) & 1);

      if (merkleProofSiblings[i] === undefined) {
        merkleProofSiblings[i] = BigInt(0);
      }
    }

    const INPUT: ICircomSemaphoreInputs = {
      identityTrapdoor: BigInt(identityTrapdoor),
      identityNullifier: BigInt(identityNullifier),
      message: signalHash,
      merkleProofIndices,
      merkleProofSiblings,
      merkleProofLength: tree.depth,
      scope: CircomUtils.stringToPoseidonHash(roundIdentifier),
    };

    return this._prove(INPUT);
  }

  public verify(
    signal: string,
    anonymitySet: Commitment[],
    roundIdentifier: string,
    signalNullifier: NullifierBNS,
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    const tree = new LeanIMT((a, b) => poseidon2([a, b]));

    // Sort the anonymity set
    anonymitySet.sort();

    anonymitySet.forEach((anonymitySetEntry) => {
      tree.insert(anonymitySetEntry);
    });

    const inputs = factoryCircomSemaphoreVerificationInputs(
      tree.root,
      BigInt(signalNullifier),
      signal,
    );
    return this._verify(proof, inputs);
  }
}
