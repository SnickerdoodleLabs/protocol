import { BytesLike } from "ethers";

export class P256VerificationData {
  public constructor(
    public authenticatorData: BytesLike,
    public clientDataJSONLeft: string,
    public clientDataJSONRight: string,
  ) {}
}
