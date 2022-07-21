import { EPortNames } from "@shared/enums/ports";

export const INTERNAL_PORTS = [
  EPortNames.SD_FULL_SCREEN,
  EPortNames.SD_POPUP,
  EPortNames.SD_NOTIFICATION,
];

export const EXTERNAL_PORTS = [EPortNames.SD_CONTENT_SCRIPT];

export const PORT_NOTIFICATION = "notification";

export const CONTENT_SCRIPT_SUBSTREAM = "SD_CONTENT_SCRIPT_SUBSTREAM";
export const ONBOARDING_PROVIDER_SUBSTREAM = "SD_ONBOARDING_PROVIDER_SUBSTREAM";

export const CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER =
  "SD_CONTENT_SCRIPT_CHANNEL";
export const ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER =
  "SD_ONBOARDING_PROVIDER_CHANNEL";
