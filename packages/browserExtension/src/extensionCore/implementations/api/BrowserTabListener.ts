import { inject, injectable } from "inversify";
import { okAsync } from "neverthrow";
import Browser, { Tabs } from "webextension-polyfill";

import { IBrowserTabListener } from "@interfaces/api";
import {
  IUserSiteInteractionService,
  IUserSiteInteractionServiceType,
} from "@interfaces/business";
import {
  SiteVisit,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { URL_PROTOCOLS } from "@shared/constants/url";

@injectable()
export class BrowserTabListener implements IBrowserTabListener {
  private siteVisits = new Map<
    number,
    { origin: URLString; startTime: UnixTimestamp }
  >();

  constructor(
    @inject(IUserSiteInteractionServiceType)
    protected userSiteInteractionService: IUserSiteInteractionService,
    @inject(ITimeUtilsType)
    protected timeUtils: ITimeUtils,
  ) {}

  public initialize() {
    Browser.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
    Browser.tabs.onRemoved.addListener(this.onTabRemoved.bind(this));
    return okAsync(undefined);
  }

  private onTabUpdated(
    tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
    tab: Tabs.Tab,
  ) {
    if (
      changeInfo.status == "complete" &&
      tab.status == "complete" &&
      tab.url != undefined
    ) {
      const url = new URL(tab.url);
      const tabInfo = this.siteVisits.get(tabId);
      if (tabInfo) {
        if (tabInfo.origin === url.origin) {
          // do nothing
        } else {
          // send site visit and updatevalues
          const siteVisit = new SiteVisit(
            tabInfo.origin,
            tabInfo.startTime,
            this.timeUtils.getUnixNow(),
          );
          //send to service
          this.userSiteInteractionService.addSiteVisits([siteVisit]);
          // reset values
          this.siteVisits.set(tabId, {
            origin: URLString(url.origin),
            startTime: this.timeUtils.getUnixNow(),
          });
        }
      } else {
        if (URL_PROTOCOLS.includes(url.protocol)) {
          this.siteVisits.set(tabId, {
            origin: URLString(url.origin),
            startTime: this.timeUtils.getUnixNow(),
          });
        }
      }
    }
  }

  private onTabRemoved(
    tabId: number,
    removeInfo: Tabs.OnRemovedRemoveInfoType,
  ) {
    const tabInfo = this.siteVisits.get(tabId);
    if (tabInfo) {
      const siteVisit = new SiteVisit(
        tabInfo.origin,
        tabInfo.startTime,
        this.timeUtils.getUnixNow(),
      );
      // send to service
      this.userSiteInteractionService.addSiteVisits([siteVisit]);
      // clear item
      this.siteVisits.delete(tabId);
    }
  }
}
