import errorCodes from "@objects/errors/errorCodes.js";
import { IpfsCID } from "@objects/primitives/index.js";

export class QueryExpiredError extends Error {
  protected errorCode: string = errorCodes[QueryExpiredError.name];
  constructor(public message: string, public queryCID: IpfsCID) {
    super(message);
  }
}
