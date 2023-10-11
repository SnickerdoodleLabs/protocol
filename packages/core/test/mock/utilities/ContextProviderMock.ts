import {
  BackupCreatedEvent,
  BackupRestoreEvent,
  ComponentStatus,
  CountryCode,
  DataPermissionsUpdatedEvent,
  DataWalletAddress,
  EChain,
  EComponentStatus,
  EExternalApi,
  EQueryEvents,
  Gender,
  IpfsCID,
  LinkedAccount,
  PublicEvents,
  QueryPerformanceEvent,
  QueryStatus,
  SDQLQueryRequest,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreContext, PrivateEvents } from "@core/interfaces/objects/index.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";
import {
  dataWalletAddress,
  dataWalletKey,
} from "@core-tests/mock/mocks/commonValues.js";

export class ContextProviderMock implements IContextProvider {
  public context: CoreContext;

  public publicEvents: PublicEvents;
  public privateEvents: PrivateEvents;

  public onInitializedActivations: DataWalletAddress[] = [];
  public onQueryPostedActivations: SDQLQueryRequest[] = [];
  public onQueryStatusUpdatedActivations: QueryStatus[] = [];
  public onQueryParametersRequiredActivations: IpfsCID[] = [];
  public onAccountAddedActivations: LinkedAccount[] = [];
  public onPasswordAddedActivations: void[] = [];
  public onAccountRemovedActivations: LinkedAccount[] = [];
  public onPasswordRemovedActivations: void[] = [];
  public onDataPermissionsUpdatedActivations: DataPermissionsUpdatedEvent[] =
    [];
  public heartbeatActivations: void[] = [];
  public onApiAccessedActivations: EExternalApi[] = [];
  public onQueryPerformanceActivations: QueryPerformanceEvent[] = [];
  public postBackupsRequestedActivations: void[] = [];
  public onBackupCreatedActivations: BackupCreatedEvent[] = [];
  public onBackupRestoredActivations: BackupRestoreEvent[] = [];
  public onBirthdayUpdatedActivations: UnixTimestamp[] = [];
  public onGenderUpdatedActivations: Gender[] = [];
  public onLocationUpdatedActivations: CountryCode[] = [];

  constructor(context: CoreContext | null = null) {
    if (context != null) {
      this.context = context;
    } else {
      this.context = new CoreContext(
        dataWalletAddress, // dataWalletAddress
        dataWalletKey, // dataWalletKey
        false, // initializeInProgress
        new PublicEvents(), //publicEvents
        new PrivateEvents(), // privateEvents
        false, // restoreInProgress
        UnixTimestamp(0), // startTime,
        new ComponentStatus(
          EComponentStatus.TemporarilyDisabled,
          EComponentStatus.TemporarilyDisabled,
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
        ), // components
      );
    }

    this.publicEvents = this.context.publicEvents;
    this.privateEvents = this.context.privateEvents;

    this.publicEvents.onInitialized.subscribe((val) => {
      this.onInitializedActivations.push(val);
    });

    this.publicEvents.onQueryPosted.subscribe((val) => {
      this.onQueryPostedActivations.push(val);
    });

    this.publicEvents.onQueryStatusUpdated.subscribe((val) => {
      this.onQueryStatusUpdatedActivations.push(val);
    });

    this.publicEvents.onQueryParametersRequired.subscribe((val) => {
      this.onQueryParametersRequiredActivations.push(val);
    });

    this.publicEvents.onAccountAdded.subscribe((val) => {
      this.onAccountAddedActivations.push(val);
    });

    this.publicEvents.onPasswordAdded.subscribe((val) => {
      this.onPasswordAddedActivations.push(val);
    });

    this.publicEvents.onAccountRemoved.subscribe((val) => {
      this.onAccountRemovedActivations.push(val);
    });

    this.publicEvents.onPasswordRemoved.subscribe((val) => {
      this.onPasswordRemovedActivations.push(val);
    });

    this.publicEvents.onDataPermissionsUpdated.subscribe((val) => {
      this.onDataPermissionsUpdatedActivations.push(val);
    });

    this.publicEvents.onBackupCreated.subscribe((val) => {
      this.onBackupCreatedActivations.push(val);
    });

    this.publicEvents.onBackupRestored.subscribe((val) => {
      this.onBackupRestoredActivations.push(val);
    });

    this.publicEvents.onBirthdayUpdated.subscribe((val) => {
      this.onBirthdayUpdatedActivations.push(val);
    });

    this.publicEvents.onGenderUpdated.subscribe((val) => {
      this.onGenderUpdatedActivations.push(val);
    });

    this.publicEvents.onLocationUpdated.subscribe((val) => {
      this.onLocationUpdatedActivations.push(val);
    });

    this.privateEvents.heartbeat.subscribe((val) => {
      this.heartbeatActivations.push(val);
    });

    this.privateEvents.onApiAccessed.subscribe((val) => {
      this.onApiAccessedActivations.push(val);
    });

    this.publicEvents.queryPerformance.subscribe((val) => {
      this.onQueryPerformanceActivations.push(val);
    });
    this.privateEvents.postBackupsRequested.subscribe((val) => {
      this.postBackupsRequestedActivations.push(val);
    });
  }

  public getContext(): ResultAsync<CoreContext, never> {
    return okAsync({ ...this.context });
  }

  public setContextValues = new Array<CoreContext>();
  public setContext(context: CoreContext): ResultAsync<void, never> {
    this.setContextValues.push({ ...context });
    return okAsync<null, never>(null).map(() => {});
  }

  public assertEventCounts(expectedCounts: IExpectedEventCounts): void {
    const counts: IExpectedEventCounts = {
      onInitialized: 0,
      onQueryPosted: 0,
      onQueryStatusUpdated: 0,
      onQueryParametersRequired: 0,
      onAccountAdded: 0,
      onPasswordAdded: 0,
      onAccountRemoved: 0,
      onPasswordRemoved: 0,
      onDataPermissionsUpdated: 0,
      heartbeat: 0,
      onApiAccessed: 0,
      onBackupCreated: 0,
      onBackupRestored: 0,
      onBirthdayUpdated: 0,
      onGenderUpdated: 0,
      onLocationUpdated: 0,
      onQueryPerformanceActivations: 0,
      postBackupsRequested: 0,
    };

    // Merge the passed in counts with the basic counts
    Object.assign(counts, expectedCounts);

    expect(this.onInitializedActivations.length).toBe(counts.onInitialized);
    expect(this.onQueryPostedActivations.length).toBe(counts.onQueryPosted);
    expect(this.onQueryStatusUpdatedActivations.length).toBe(
      counts.onQueryStatusUpdated,
    );
    expect(this.onQueryParametersRequiredActivations.length).toBe(
      counts.onQueryParametersRequired,
    );
    expect(this.onAccountAddedActivations.length).toBe(counts.onAccountAdded);
    expect(this.onPasswordAddedActivations.length).toBe(counts.onPasswordAdded);
    expect(this.onAccountRemovedActivations.length).toBe(
      counts.onAccountRemoved,
    );
    expect(this.onPasswordRemovedActivations.length).toBe(
      counts.onPasswordRemoved,
    );
    expect(this.onDataPermissionsUpdatedActivations.length).toBe(
      counts.onDataPermissionsUpdated,
    );
    expect(this.heartbeatActivations.length).toBe(counts.heartbeat);
    expect(this.onApiAccessedActivations.length).toBe(counts.onApiAccessed);
    expect(this.onBackupCreatedActivations.length).toBe(counts.onBackupCreated);
    expect(this.onBackupRestoredActivations.length).toBe(
      counts.onBackupRestored,
    );
    expect(this.onBirthdayUpdatedActivations.length).toBe(
      counts.onBirthdayUpdated,
    );
    expect(this.onGenderUpdatedActivations.length).toBe(counts.onGenderUpdated);
    expect(this.onLocationUpdatedActivations.length).toBe(
      counts.onLocationUpdated,
    );
  }
}

export interface IExpectedEventCounts {
  onInitialized?: number;
  onQueryPosted?: number;
  onQueryStatusUpdated?: number;
  onQueryParametersRequired?: number;
  onAccountAdded?: number;
  onPasswordAdded?: number;
  onAccountRemoved?: number;
  onPasswordRemoved?: number;
  onDataPermissionsUpdated?: number;
  heartbeat?: number;
  onApiAccessed?: number;
  onBackupCreated?: number;
  onBackupRestored?: number;
  onBirthdayUpdated?: number;
  onGenderUpdated?: number;
  onLocationUpdated?: number;
  onQueryPerformanceActivations?: number;
  postBackupsRequested?: number;
}
