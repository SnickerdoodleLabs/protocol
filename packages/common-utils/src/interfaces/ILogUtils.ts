/* eslint-disable @typescript-eslint/no-explicit-any */
import pino from "pino";

export interface ILogUtils {
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  log(message?: any, ...optionalParams: any[]): void;
  warning(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  getPino(): pino.Logger;
}

export const ILogUtilsType = Symbol.for("ILogUtils");
