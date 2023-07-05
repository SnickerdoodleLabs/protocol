import {
  EncryptedString,
  InitializationVector,
} from "@objects/primitives/index.js";

export class AESEncryptedString {
  public constructor(
    public data: EncryptedString,
    public initializationVector: InitializationVector,
  ) {}
}
