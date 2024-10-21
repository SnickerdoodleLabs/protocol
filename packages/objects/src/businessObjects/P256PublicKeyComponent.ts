import {
  PasskeyId,
  PasskeyPublicKeyPointX,
  PasskeyPublicKeyPointY,
} from "@objects/primitives/index.js";

export class P256PublicKeyComponent {
  public constructor(
    public x: PasskeyPublicKeyPointX,
    public y: PasskeyPublicKeyPointY,
    public keyId: PasskeyId,
  ) {}
}
