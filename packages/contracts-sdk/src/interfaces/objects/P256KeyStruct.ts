import { JSONString } from "@snickerdoodlelabs/objects";
import { BytesLike } from "ethers";

export class P256KeyStruct {
  public constructor(
    public x: string,
    public y: string,
    public keyId: string,
  ) {}
}
