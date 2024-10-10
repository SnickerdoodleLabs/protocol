import {
  PasskeyId,
  PasskeyPublicKeyPointX,
  PasskeyPublicKeyPointY,
} from "@objects/primitives/index.js";

export class P256SignatureComponent {
  public constructor(
    public r: PasskeyPublicKeyPointX,
    public s: PasskeyPublicKeyPointY,
  ) {}
}
