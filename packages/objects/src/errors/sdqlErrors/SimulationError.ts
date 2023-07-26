import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class SimulationError extends BaseError {
  protected errorCode: string = errorCodes[SimulationError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[SimulationError.name], src, false);
  }
}
