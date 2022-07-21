import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";

import { Signature } from "@objects/primitives";

export class MetatransactionSignatureRequest {
  public constructor(
    public domain: TypedDataDomain,
    public types: Record<string, TypedDataField[]>,
    public data: Record<string, unknown>,
    public callback: (signature: Signature) => void,
  ) {}
}
