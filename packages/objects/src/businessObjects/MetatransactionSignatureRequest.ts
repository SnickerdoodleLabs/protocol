import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";

import {
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  Signature,
} from "@objects/primitives";

export class MetatransactionSignatureRequest {
  public constructor(
    public accountAddress: EVMAccountAddress,
    public contractAddress: EVMContractAddress,
    public data: HexString,
    public callback: (signature: Signature, nonce: BigNumberString) => void,
  ) {}
}
