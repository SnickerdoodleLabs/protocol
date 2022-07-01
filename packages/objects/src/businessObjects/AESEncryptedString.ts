import { EncryptedString, InitializationVector } from "@objects/primatives";

export class AESEncryptedString {
  public constructor(
    public data: EncryptedString,
    public initializationVector: InitializationVector,
  ) {}
}
