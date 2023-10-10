import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class SimulationError extends BaseError {
  protected errorCode: string = errorCodes[SimulationError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[SimulationError.name], src, false);
  }
}
