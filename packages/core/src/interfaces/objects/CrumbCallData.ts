import { HexString, TokenId } from "@snickerdoodlelabs/objects";

export class CrumbCallData {
  public constructor(public callData: HexString, public crumbId: TokenId) {}
}
