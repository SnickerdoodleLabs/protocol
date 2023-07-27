import errorCodes from "@objects/errors/errorCodes.js";
export class SimulationError extends Error {
  protected errorCode: string = errorCodes[SimulationError.name];
}
