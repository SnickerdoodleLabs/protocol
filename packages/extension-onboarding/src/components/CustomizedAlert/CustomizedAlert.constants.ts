export enum EAlertSeverity {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export const SEVERITY_COLORS = {
  [EAlertSeverity.SUCCESS]: "#DAFAE1",
  [EAlertSeverity.INFO]: "red",
  [EAlertSeverity.ERROR]: "red",
  [EAlertSeverity.WARNING]: "red",
};
