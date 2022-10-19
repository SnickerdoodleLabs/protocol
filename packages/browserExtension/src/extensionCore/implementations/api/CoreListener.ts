import { BrowserUtils } from "@enviroment/shared/utils";
import { ICoreListener } from "@interfaces/api";
import {
  IAccountCookieUtils,
  IAccountCookieUtilsType,
  IContextProvider,
  IContextProviderType,
} from "@interfaces/utilities";
import {
  DataWalletAddress,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ISnickerdoodleCoreType,
  LinkedAccount,
  SDQLQueryRequest,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import Browser from "webextension-polyfill";

@injectable()
export class CoreListener implements ICoreListener {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IAccountCookieUtilsType)
    protected accountCookieUtils: IAccountCookieUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    this.core.getEvents().map((events: ISnickerdoodleCoreEvents) => {
      events.onInitialized.subscribe(this.onInitialized.bind(this));
      events.onAccountAdded.subscribe(this.onAccountAdded.bind(this));
      events.onAccountRemoved.subscribe(this.onAccountRemoved.bind(this));
      events.onQueryPosted.subscribe(this.onQueryPosted.bind(this));
      events.onQueryAccepted.subscribe(this.onQueryAccepted.bind(this));
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
    this.accountCookieUtils.writeDataWalletAddressToCookie(dataWalletAddress);
    this.contextProvider.setAccountContext(dataWalletAddress);
    console.log("onInitialized", dataWalletAddress);
    return okAsync(undefined);
  }

  private onAccountAdded(account: LinkedAccount) {
    this.contextProvider.onAccountAdded(account);
    console.log("onAccountAdded", account);
    return okAsync(undefined);
  }

  private onQueryPosted(request: SDQLQueryRequest) {
    console.log(
      `onQueryPosted. Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
    );
    console.debug(request.query.query);
    
    this.core
      .processRewardsPreview(
        request.consentContractAddress, 
        {
          cid: request.query.cid,
          query: this.getStringQuery(request),
        },
        request.rewardsPreview
        )
      .mapErr((e) => {
        console.error(
          `Error while creating preview! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
        );
        console.error(e);
      });
    
  }


  private onQueryAccepted(request: SDQLQueryRequest){
    console.log(`onQueryAccepted. Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,);

    
    this.core
    .processQuery(request.consentContractAddress, {
      cid: request.query.cid,
      query: this.getStringQuery(request),
    })
    .mapErr((e) => {
      console.error(
        `Error while processing query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
      );
      console.error(e);
    });
  }

  private getStringQuery(request: SDQLQueryRequest) {
    const queryObjOrStr = request.query.query;
    let queryString: SDQLString;
    if (typeof queryObjOrStr === "object") {
      queryString = JSON.stringify(queryObjOrStr) as SDQLString;
    } else {
      queryString = queryObjOrStr;
    }
    return queryString;
  }

  private onAccountRemoved(account: LinkedAccount) {
    this.accountCookieUtils.removeAccountInfoFromCookie(
      account.sourceAccountAddress,
    );
    this.contextProvider.onAccountRemoved(account);
  }
}
