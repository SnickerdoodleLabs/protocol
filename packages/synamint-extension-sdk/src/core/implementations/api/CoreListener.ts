import {
  DataWalletAddress,
  EarnedReward,
  EVMContractAddress,
  IDynamicRewardParameter,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ISnickerdoodleCoreType,
  LinkedAccount,
  RecipientAddressType,
  SDQLQueryRequest,
  SDQLString,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";
import { ICoreListener } from "@synamint-extension-sdk/core/interfaces/api";
import {
  IInvitationService,
  IInvitationServiceType,
} from "@synamint-extension-sdk/core/interfaces/business";
import {
  IAccountCookieUtils,
  IAccountCookieUtilsType,
  IContextProvider,
  IContextProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { BrowserUtils } from "@synamint-extension-sdk/enviroment/shared/utils";
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
    @inject(IInvitationServiceType)
    protected invitationService: IInvitationService,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.core.getEvents().map((events: ISnickerdoodleCoreEvents) => {
      events.onInitialized.subscribe(this.onInitialized.bind(this));
      events.onAccountAdded.subscribe(this.onAccountAdded.bind(this));
      events.onAccountRemoved.subscribe(this.onAccountRemoved.bind(this));
      events.onQueryPosted.subscribe(this.onQueryPosted.bind(this));
      events.onEarnedRewardsAdded.subscribe(
        this.onEarnedRewardsAdded.bind(this),
      );
      events.onDiscordProfileLinked.subscribe(this.onDiscordProfileLinked.bind(this));
      events.onDiscordProfileUnlinked.subscribe(this.onDiscordProfileUnlinked.bind(this));
    });
  }

  private onInitialized(dataWalletAddress: DataWalletAddress): void {
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
    console.log(
      `Extension: Initialized data wallet with address ${dataWalletAddress}`,
    );
  }

  private onAccountAdded(account: LinkedAccount): void {
    this.contextProvider.onAccountAdded(account);
    console.log(`Extension: account ${account.sourceAccountAddress} added`);
  }

  private onQueryPosted(request: SDQLQueryRequest): void {
    console.log(
      `Extension: query posted with contract address: ${request.consentContractAddress} and CID: ${request.query.cid}`,
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

    // DynamicRewardParameters added to be returned
    const parameters: IDynamicRewardParameter[] = [];
    // request.accounts.filter((acc.sourceAccountAddress == request.dataWalletAddress) ==> (acc))

    this.invitationService
      .getReceivingAddress(request.consentContractAddress)
      .map((accountAddress) => {
        request.rewardsPreview.forEach((element) => {
          if (request.dataWalletAddress !== null) {
            parameters.push({
              recipientAddress: {
                type: "address",
                value: RecipientAddressType(accountAddress),
              },
            } as IDynamicRewardParameter);
          }
        });

        this.core
          .processQuery(
            request.consentContractAddress,
            {
              cid: request.query.cid,
              query: getStringQuery(),
            },
            parameters,
          )
          .map(() => {
            console.log(
              `Processing Query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
            );
          })
          .mapErr((e) => {
            console.error(
              `Error while processing query! Contract Address: ${request.consentContractAddress}, CID: ${request.query.cid}`,
            );
            console.error(e);
          });
      });
  }

  private onAccountRemoved(account: LinkedAccount): void {
    console.log(`Extension: account ${account.sourceAccountAddress} removed`);
    this.accountCookieUtils.removeAccountInfoFromCookie(
      account.sourceAccountAddress,
    );
    this.contextProvider.onAccountRemoved(account);
  }

  private onEarnedRewardsAdded(rewards: EarnedReward[]): void {
    this.contextProvider.onEarnedRewardsAdded(rewards);
}
  private onDiscordProfileLinked(id: SnowflakeID): void {}

  private onDiscordProfileUnlinked(id: SnowflakeID): void {}
}
