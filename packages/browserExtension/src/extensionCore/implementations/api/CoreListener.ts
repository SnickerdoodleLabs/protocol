import {
  DataWalletAddress,
  EVMAccountAddress,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ISnickerdoodleCoreType,
  MetatransactionSignatureRequest,
  SDQLQueryRequest,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ok, okAsync, ResultAsync } from "neverthrow";
import Browser from "webextension-polyfill";

import { BrowserUtils } from "@enviroment/shared/utils";
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
    // @TODO move it to right place
    BrowserUtils.browserAction.getPopup({}).then((popup) => {
      if (!popup) {
        BrowserUtils.browserAction.setPopup({
          popup: Browser.runtime.getURL("popup.html"),
        });
      }
    });
    this.contextProvider.setAccountContext(dataWalletAddress);
    console.log("onInitialized", dataWalletAddress);
    return okAsync(undefined);
  }

  private onAccountAdded(account: EVMAccountAddress) {
    this.contextProvider.addAccount(account);
    console.log("onAccountAdded", account);
    return okAsync(undefined);
  }

  private onQueryPosted(request: SDQLQueryRequest) {
    
    console.log(
      `onQueryPosted. Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
    );
    console.debug(request.query.query);

    // @TODO - remove once ipfs issue is resolved
    const getStringQuery = () => {
      const queryObjOrStr = request.query.query;
      let queryString: SDQLString;
      if (typeof queryObjOrStr === "object") {
        queryString = JSON.stringify(queryObjOrStr) as SDQLString;
      } else {
        queryString = queryObjOrStr;
      }
      return queryString;
    };

    this.core
      .processQuery(request.consentContractAddress, {
        cid: request.query.cid,
        query: getStringQuery(),
      })
      .mapErr((e) => {
        console.error(
          `Error while processing query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
        );
        console.error(e);
      });
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
