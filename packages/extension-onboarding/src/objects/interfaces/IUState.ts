import { UnixTimestamp } from "@snickerdoodlelabs/objects";

export enum EOnboardingState {
  INTRO = "INTRO",
  TOS_PP = "TOS&PP",
  COMPLETED = "COMPLETED",
}

export enum EAchievementType {
  PROFILE_CREATION = "PROFILE_CREATION",
}

export enum EPageKeys {
  HOME = "HOME",
  COOKIE_VAULT = "COOKIE_VAULT",
  TRUSTED_BRANDS = "TRUSTED_BRANDS",
  OFFERS = "OFFERS",
  MY_ACCOUNT = "MY_ACCOUNT",
}

export enum EInfoCardVisiblity {
  VISIBLE = "VISIBLE",
  HIDDEN = "HIDDEN",
}

export interface IAchievementBadge {
  key: EAchievementType;
  name: string;
  description: string;
  image: string;
}

export enum EEventType {
  ACHIEVEMENT_UNLOCKED = "ACHIEVEMENT_UNLOCKED",
  CP_EARNED = "CP_EARNED",
}

export enum EReason {
  PROFILE_CREATION = "PROFILE_CREATION",
  WEB_3_ACCOUNT_LINKED = "WEB_3_ACCOUNT_LINKED",
  SOCIAL_ACCOUNT_LINKED = "SOCIAL_ACCOUNT_LINKED",
}

export interface IEvent {
  type: EEventType;
  reason: EReason;
  timestamp: UnixTimestamp;
}

export interface IUIState {
  onboardingState: EOnboardingState;
  events: IEvent[];
  infoCards: Record<EPageKeys, EInfoCardVisiblity>;
}
