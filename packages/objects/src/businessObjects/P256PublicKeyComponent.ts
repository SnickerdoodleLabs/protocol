import {
  PasskeyId,
  P256PublicKeyPointX,
  P256PublicKeyPointY,
} from "@objects/primitives/index.js";

export class P256PublicKeyComponents {
  public constructor(
    public x: P256PublicKeyPointX,
    public y: P256PublicKeyPointY,
  ) {}
}
