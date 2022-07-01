export enum EPortNames {
  SD_POPUP = "SD_POPUP",
  SD_NOTIFICATION = "SD_NOTIFICATION",
  SD_FULL_SCREEN = "SD_FULLSCREEN",
  SD_CONTENT_SCRIPT = "SD_CONTENT_SCRIPT",
}

export enum EConnectionModes {
  SD_INTERNAL = "SD_INTERNAL",
  EXTERNAL = "EXTERNAL",
}

export const INTERNAL_PORTS = [
  EPortNames.SD_FULL_SCREEN,
  EPortNames.SD_POPUP,
  EPortNames.SD_NOTIFICATION,
];

export const PORT_NOTIFICATION = "notification";
