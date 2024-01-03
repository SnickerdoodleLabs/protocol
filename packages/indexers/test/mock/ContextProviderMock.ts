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
  Gender,
  IpfsCID,
  LinkedAccount,
  PublicEvents,
  SDQLQueryRequest,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import {
  IIndexerContext,
  IIndexerContextProvider,
} from "@indexers/interfaces/index.js";

class IndexerContext implements IIndexerContext {
  public constructor(
    public components: ComponentStatus,
    public privateEvents: { onApiAccessed: Subject<EExternalApi> },
  ) {}
}

export class ContextProviderMock implements IIndexerContextProvider {
  public context: IndexerContext;

  public privateEvents: { onApiAccessed: Subject<EExternalApi> };

  public onApiAccessedActivations: EExternalApi[] = [];

  constructor(context: IndexerContext | null = null) {
    if (context != null) {
      this.context = context;
    } else {
      this.context = new IndexerContext(
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
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
        ),
        {
          onApiAccessed: new Subject<EExternalApi>(),
        },
      );
    }

    this.privateEvents = this.context.privateEvents;

    this.privateEvents.onApiAccessed.subscribe((val) => {
      this.onApiAccessedActivations.push(val);
    });
  }

  public setContext(context: IIndexerContext): ResultAsync<void, never> {
    throw new Error("Method not implemented.");
  }

  public getContext(): ResultAsync<IndexerContext, never> {
    return okAsync({ ...this.context });
  }

  public assertEventCounts(expectedCounts: IExpectedEventCounts): void {
    const counts: IExpectedEventCounts = {
      onApiAccessed: 0,
    };

    // Merge the passed in counts with the basic counts
    Object.assign(counts, expectedCounts);

    expect(this.onApiAccessedActivations.length).toBe(counts.onApiAccessed);
  }
}

export interface IExpectedEventCounts {
  onApiAccessed?: number;
}
