export enum EAlertSeverity {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export const SEVERITY_COLORS = {
  [EAlertSeverity.SUCCESS]: "#DAFAE1",
  [EAlertSeverity.INFO]: "red",
  [EAlertSeverity.ERROR]: "#DC143C",
  [EAlertSeverity.WARNING]: "red",
};

export const SEVERITY_TEXT_COLORS = {
  [EAlertSeverity.SUCCESS]: "#232039",
  [EAlertSeverity.INFO]: "#fff",
  [EAlertSeverity.ERROR]: "#fff",
  [EAlertSeverity.WARNING]: "#fff",
};
