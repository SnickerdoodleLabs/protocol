import { P256SignatureR, P256SignatureS } from "@objects/primitives/index.js";

export class P256SignatureComponent {
  public constructor(public r: P256SignatureR, public s: P256SignatureS) {}
}
