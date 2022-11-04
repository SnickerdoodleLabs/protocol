import errorCodes from "@objects/errors/errorCodes";

export class ServerRewardError extends Error {
  protected errorCode: string = errorCodes[ServerRewardError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
