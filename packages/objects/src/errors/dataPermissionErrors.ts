
export class MissingWalletDataTypeError extends Error {
  constructor(name: string) {
    super(`no wallet data type defined for ${name}`);
  }
}

export class PermissionError extends Error {}