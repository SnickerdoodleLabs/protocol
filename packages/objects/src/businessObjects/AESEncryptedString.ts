import { EncryptedString, InitializationVector } from "@objects/primitives";

export class AESEncryptedString {
  public constructor(
    public data: EncryptedString,
    public initializationVector: InitializationVector,
  ) {}
}
