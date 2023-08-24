import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import { pino } from "pino";

export class MockLogUtils implements ILogUtils {
  debug(message?: string, ...optionalParams: unknown[]): void {
    console.log(message);
    console.log(optionalParams);
  }
  info(message?: string, ...optionalParams: unknown[]): void {
    console.log(message);
    console.log(optionalParams);
  }
  log(message?: string, ...optionalParams: unknown[]): void {
    console.log(message);
    console.log(optionalParams);
  }
  warning(message?: string, ...optionalParams: unknown[]): void {
    console.log(message);
    console.log(optionalParams);
  }
  error(message?: string, ...optionalParams: unknown[]): void {
    console.log(message);
    console.log(optionalParams);
  }
  getPino(): pino.Logger<pino.LoggerOptions> {
    throw new Error("Method not implemented.");
  }
}
