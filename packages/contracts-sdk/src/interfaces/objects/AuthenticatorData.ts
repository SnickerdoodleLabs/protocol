import { JSONString } from "@snickerdoodlelabs/objects";
import { BytesLike } from "ethers";

export class AuthenticatorData {
  public constructor(
    public authenticatorData: BytesLike,
    public clientDataJSONLeft: string,
    public clientDataJSONRight: string,
  ) {}
}
