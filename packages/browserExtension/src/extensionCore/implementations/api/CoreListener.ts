import {
  DataWalletAddress,
  EVMAccountAddress,
  EVMContractAddress,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ISnickerdoodleCoreType,
  MetatransactionSignatureRequest,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ok, okAsync, ResultAsync } from "neverthrow";

import { ICoreListener } from "@interfaces/api";
import { IContextProvider, IContextProviderType } from "@interfaces/utilities";

@injectable()
export class CoreListener implements ICoreListener {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public initialize(): ResultAsync<void, never> {
    this.core.getEvents().map((events: ISnickerdoodleCoreEvents) => {
      events.onInitialized.subscribe(this.onInitialized.bind(this));
      events.onAccountAdded.subscribe(this.onAccountAdded.bind(this));
      events.onQueryPosted.subscribe(this.onQueryPosted.bind(this));
      events.onMetatransactionSignatureRequested.subscribe(
        this.onMetatransactionSignatureRequested.bind(this),
      );
      return ok(undefined);
    });
    return okAsync(undefined);
  }
  private onInitialized(dataWalletAddress: DataWalletAddress) {
    console.log("onInitialized", dataWalletAddress);
    return okAsync(undefined);
  }

  private onAccountAdded(account: EVMAccountAddress) {
    console.log("onAccountAdded", account);
    return okAsync(undefined);
  }

  private onQueryPosted(query: {
    consentContractAddress: EVMContractAddress;
    query: SDQLQuery;
  }) {
    console.log("onQueryPosted", query);
    return okAsync(undefined);
  }

  // Todo move logic to correct place
  private onMetatransactionSignatureRequested(
    metatransactionSignatureRequest: MetatransactionSignatureRequest,
  ) {
    this.contextProvider.notifyPortsWithIncomingMetatransactionSignatureRequest(
      metatransactionSignatureRequest,
    );
  }
}
