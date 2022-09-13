import errorCodes from "@objects/errors/errorCodes";
import { IpfsCID } from "@objects/primitives/IpfsCID";

export class QueryExpiredError extends Error {
  protected errorCode: string = errorCodes[QueryExpiredError.name];
  constructor(public message: string, public queryId: IpfsCID) {
    super(message);
  }
}
