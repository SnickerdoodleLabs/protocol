import { ResultAsync } from "neverthrow";

import {
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  Signature,
} from "@objects/primitives";

export class MetatransactionSignatureRequest<TErr = unknown> {
  public constructor(
    public accountAddress: EVMAccountAddress,
    public contractAddress: EVMContractAddress,
    public value: BigNumberString,
    public gas: BigNumberString,
    public data: HexString,
    public callback: (
      signature: Signature,
      nonce: BigNumberString,
    ) => ResultAsync<void, TErr>,
  ) {}
}
