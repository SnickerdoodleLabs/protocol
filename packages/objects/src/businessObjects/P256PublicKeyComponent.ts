import {
  PasskeyId,
  P256PublicKeyPointX,
  P256PublicKeyPointY,
} from "@objects/primitives/index.js";

export class P256PublicKeyComponent {
  public constructor(
    public x: P256PublicKeyPointX,
    public y: P256PublicKeyPointY,
    public keyId: PasskeyId,
  ) {}
}
