import errorCodes from "@objects/errors/errorCodes.js";

export class MissingWalletDataTypeError extends Error {
  protected errorCode: string = errorCodes[MissingWalletDataTypeError.name];
  constructor(name: string) {
    super(`no wallet data type defined for ${name}`);
  }
}
