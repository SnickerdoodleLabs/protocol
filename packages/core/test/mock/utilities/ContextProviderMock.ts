import {
  DataPermissionsUpdatedEvent,
  DataWalletAddress,
  IpfsCID,
  LinkedAccount,
  SDQLQueryRequest,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreContext, PublicEvents } from "@core/interfaces/objects/index.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";
import {
  dataWalletAddress,
  dataWalletKey,
} from "@core-tests/mock/mocks/commonValues.js";

export class ContextProviderMock implements IContextProvider {
  public context: CoreContext;

  public publicEvents: PublicEvents;

  public onInitializedActivations: DataWalletAddress[] = [];
  public onQueryPostedActivations: SDQLQueryRequest[] = [];
  public onQueryParametersRequiredActivations: IpfsCID[] = [];
  public onAccountAddedActivations: LinkedAccount[] = [];
  public onAccountRemovedActivations: LinkedAccount[] = [];
  public onDataPermissionsUpdatedActivations: DataPermissionsUpdatedEvent[] =
    [];
  public heartbeatActivations: void[] = [];

  constructor(context: CoreContext | null = null) {
    if (context != null) {
      this.context = context;
    } else {
      this.context = new CoreContext(
        dataWalletAddress,
        dataWalletKey,
        false,
        new PublicEvents(),
        false,
        0,
      );
    }

    this.publicEvents = this.context.publicEvents;

    this.publicEvents.onInitialized.subscribe((val) => {
      this.onInitializedActivations.push(val);
    });

    this.publicEvents.onQueryPosted.subscribe((val) => {
      this.onQueryPostedActivations.push(val);
    });

    this.publicEvents.onQueryParametersRequired.subscribe((val) => {
      this.onQueryParametersRequiredActivations.push(val);
    });

    this.publicEvents.onAccountAdded.subscribe((val) => {
      this.onAccountAddedActivations.push(val);
    });

    this.publicEvents.onAccountRemoved.subscribe((val) => {
      this.onAccountRemovedActivations.push(val);
    });

    this.publicEvents.onDataPermissionsUpdated.subscribe((val) => {
      this.onDataPermissionsUpdatedActivations.push(val);
    });

    this.context.heartbeat.subscribe((val) => {
      this.heartbeatActivations.push(val);
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
      onQueryParametersRequired: 0,
      onAccountAdded: 0,
      onAccountRemoved: 0,
      onDataPermissionsUpdated: 0,
      heartbeat: 0,
    };

    // Merge the passed in counts with the basic counts
    Object.assign(counts, expectedCounts);

    expect(this.onInitializedActivations.length).toBe(counts.onInitialized);
    expect(this.onQueryPostedActivations.length).toBe(counts.onQueryPosted);
    expect(this.onQueryParametersRequiredActivations.length).toBe(
      counts.onQueryParametersRequired,
    );
    expect(this.onAccountAddedActivations.length).toBe(counts.onAccountAdded);
    expect(this.onAccountRemovedActivations.length).toBe(
      counts.onAccountRemoved,
    );
    expect(this.onDataPermissionsUpdatedActivations.length).toBe(
      counts.onDataPermissionsUpdated,
    );
    expect(this.heartbeatActivations.length).toBe(counts.heartbeat);
  }
}

export interface IExpectedEventCounts {
  onInitialized?: number;
  onQueryPosted?: number;
  onQueryParametersRequired?: number;
  onAccountAdded?: number;
  onAccountRemoved?: number;
  onDataPermissionsUpdated?: number;
  heartbeat?: number;
}
