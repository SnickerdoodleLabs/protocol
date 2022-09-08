/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import pino from "pino";

import { ILogUtils } from "@common-utils/interfaces/index.js";

@injectable()
export class LogUtils implements ILogUtils {
  protected logger: pino.Logger;

  constructor() {
    this.logger = pino({ level: "debug" });
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    this.logger.debug(message, optionalParams);
  }
  public info(message?: any, ...optionalParams: any[]): void {
    this.logger.info(message, optionalParams);
  }
  public log(message?: any, ...optionalParams: any[]): void {
    this.logger.info(message, optionalParams);
  }
  public warning(message?: any, ...optionalParams: any[]): void {
    this.logger.warn(message, optionalParams);
  }
  public error(message?: any, ...optionalParams: any[]): void {
    this.logger.error(message, optionalParams);
  }

  public getPino(): pino.Logger {
    return this.logger;
  }
}
