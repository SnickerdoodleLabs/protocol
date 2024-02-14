import {
  EAchievementType,
  EEventType,
  EInfoCardVisiblity,
  EOnboardingState,
  EPageKeys,
  EReason,
  IAchievementBadge,
  IEvent,
  IUIState,
} from "@extension-onboarding/objects/interfaces/IUState";
import { AsyncQueue } from "@extension-onboarding/utils/AsyncQue";
import { ObjectUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import { JSONString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

// TODO: this just became a service class rather than a utility class change the name

const CP_MAPPING = {
  [EReason.PROFILE_CREATION]: 100,
  [EReason.WEB_3_ACCOUNT_LINKED]: 100,
  [EReason.SOCIAL_ACCOUNT_LINKED]: 100,
};

const ACHIEVEMENT_MAPPING: Partial<Record<EReason, IAchievementBadge>> = {
  [EReason.PROFILE_CREATION]: {
    key: EAchievementType.PROFILE_CREATION,
    name: "Profile Creation",
    description: "You've created your profile",
    image: "profile-creation.png",
  },
};

const REASON_EVENT_TYPE_MAPPING: Record<EReason, EEventType> = {
  [EReason.PROFILE_CREATION]: EEventType.ACHIEVEMENT_UNLOCKED,
  [EReason.WEB_3_ACCOUNT_LINKED]: EEventType.CP_EARNED,
  [EReason.SOCIAL_ACCOUNT_LINKED]: EEventType.CP_EARNED,
};

export class UIStateUtils {
  private uiState: IUIState;
  private timeUtils: TimeUtils;
  private queue = new AsyncQueue();
  public onOnboardingStateUpdated = new Subject<EOnboardingState>();
  private events = {
    onCPEarned: new Subject<{
      amount: number;
      reason: EReason;
      isFirst: boolean;
    }>(),
    onAchievementUnlocked: new Subject<IAchievementBadge>(),
  };
  constructor(
    private _uiState: JSONString | null,
    private updateStoredState: (
      uiStateJSON: JSONString,
    ) => ResultAsync<void, unknown>,
  ) {
    this.uiState = this._uiState
      ? ObjectUtils.deserialize<IUIState>(this._uiState)
      : UIStateUtils.getInitialUIState();
    this.timeUtils = new TimeUtils();
  }

  public getUIState(): IUIState {
    return this.uiState;
  }

  public changeInfoCardVisibility(
    key: EPageKeys,
    visibility: EInfoCardVisiblity,
  ) {
    this._changeInfoCardVisibility(key, visibility);
    this._storeUIState(this.uiState);
  }

  public onAccountLinked() {
    const existingEvent = this.uiState.events.find(
      (event) => event.reason === EReason.WEB_3_ACCOUNT_LINKED,
    );
    if (!existingEvent) {
      this._addEvent(this.getEventForReason(EReason.WEB_3_ACCOUNT_LINKED));
      this._storeUIState(this.uiState);
    }
  }

  public getEvents() {
    return this.events;
  }

  public onSocialAccountLinked() {
    const existingEvent = this.uiState.events.find(
      (event) => event.reason === EReason.SOCIAL_ACCOUNT_LINKED,
    );
    if (!existingEvent) {
      this._addEvent(this.getEventForReason(EReason.SOCIAL_ACCOUNT_LINKED));
      this._storeUIState(this.uiState);
    }
  }

  public onProfileCreation() {
    const existingEvent = this.uiState.events.find(
      (event) => event.reason === EReason.PROFILE_CREATION,
    );
    if (!existingEvent) {
      this._addEvent(this.getEventForReason(EReason.PROFILE_CREATION));
      this._storeUIState(this.uiState);
    }
  }

  public getEventForReason(reason: EReason): IEvent {
    return {
      type: REASON_EVENT_TYPE_MAPPING[reason],
      reason,
      timestamp: this.timeUtils.getUnixNow(),
    };
  }

  public getOnboardingState(): EOnboardingState {
    return this.uiState.onboardingState;
  }

  public setOnboardingState(onboardingState: EOnboardingState) {
    this.onOnboardingStateUpdated.next(onboardingState);
    if (onboardingState === EOnboardingState.COMPLETED) {
      this._addEvent(this.getEventForReason(EReason.PROFILE_CREATION));
    }
    this._changeOnboardingState(onboardingState);
    this._storeUIState(this.uiState);
  }

  public getCalculatedCP(): number {
    return this.uiState.events
      .filter((event) => event.type === EEventType.CP_EARNED)
      .reduce((acc, event) => acc + (CP_MAPPING[event.reason] ?? 0), 0);
  }

  public getAchievementsBadges(): IAchievementBadge[] {
    return this.uiState.events
      .filter((event) => event.type === EEventType.ACHIEVEMENT_UNLOCKED)
      .reduce((acc, event) => {
        const achievement = ACHIEVEMENT_MAPPING[event.reason];
        if (achievement) {
          acc.push(achievement);
        }
        return acc;
      }, [] as IAchievementBadge[]);
  }

  public static getInitialUIState(): IUIState {
    return {
      onboardingState: EOnboardingState.INTRO,
      events: [],
      infoCards: {
        [EPageKeys.HOME]: EInfoCardVisiblity.VISIBLE,
        [EPageKeys.COOKIE_VAULT]: EInfoCardVisiblity.VISIBLE,
        [EPageKeys.TRUSTED_BRANDS]: EInfoCardVisiblity.VISIBLE,
        [EPageKeys.OFFERS]: EInfoCardVisiblity.VISIBLE,
        [EPageKeys.MY_ACCOUNT]: EInfoCardVisiblity.VISIBLE,
      },
    };
  }

  private _changeInfoCardVisibility(
    key: EPageKeys,
    visibility: EInfoCardVisiblity,
  ) {
    this.uiState = {
      ...this.uiState,
      infoCards: { ...this.uiState.infoCards, [key]: visibility },
    };
  }

  private _fireEvent(reason: EReason) {
    const eventType = REASON_EVENT_TYPE_MAPPING[reason];
    if (eventType === EEventType.CP_EARNED) {
      this.events.onCPEarned.next({
        amount: CP_MAPPING[reason]!,
        reason,
        isFirst: this.uiState.events.some(
          (event) => event.reason === reason && event.type === eventType,
        ),
      });
    } else if (eventType === EEventType.ACHIEVEMENT_UNLOCKED) {
      const achievement = ACHIEVEMENT_MAPPING[reason];
      if (achievement) {
        this.events.onAchievementUnlocked.next(achievement);
      }
    }
  }

  private _changeOnboardingState(onboardingState: EOnboardingState) {
    this.uiState = { ...this.uiState, onboardingState };
  }

  private _addEvent(event: IEvent) {
    this.uiState = { ...this.uiState, events: [...this.uiState.events, event] };
  }

  private _storeUIState(state: IUIState) {
    this.queue.enqueue(this.updateStoredState(ObjectUtils.serialize(state)));
  }
}
