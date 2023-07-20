import errorCodes from "@objects/errors/errorCodes.js";

export class DuplicateIdInSchema extends Error {
  protected errorCode: string = errorCodes[DuplicateIdInSchema.name];
  constructor(name: string) {
    super(`${name} already exists in the parser context`);
  }
}
