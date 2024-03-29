import { ICircomSemaphoreInputs } from "@snickerdoodlelabs/circuits";
import {
  BigNumberString,
  Commitment,
  ZKProof,
  CircuitError,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { CircomWrapper } from "@circuits-sdk/implementations/circom/CircomWrapper.js";
import { IMembershipWrapper } from "@circuits-sdk/interfaces/index.js";

@injectable()
export class CircomMembershipWrapper
  extends CircomWrapper<ICircomSemaphoreInputs>
  implements IMembershipWrapper
{
  prove(
    signal: string,
    identityTrapdoor: BigNumberString,
    identityNullifier: BigNumberString,
    anonymitySet: Commitment[],
    roundIdentifier: string,
  ): ResultAsync<ZKProof, CircuitError> {
    throw new Error("Method not implemented.");
  }
  verify(
    signal: string,
    anonymitySet: Commitment[],
    roundIdentifier: string,
    signalNullifier: BigNumberString,
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    throw new Error("Method not implemented.");
  }
}
