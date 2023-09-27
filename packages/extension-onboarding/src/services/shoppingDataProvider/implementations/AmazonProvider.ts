/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DiscordGuildProfile,
  DiscordProfile,
  DiscordID,
  URLString,
  ISdlDataWallet,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IAmazonProvider } from "../interfaces/IAmazonProvider";

import { IDiscordInitParams } from "@extension-onboarding/services/socialMediaProviders/interfaces";

export class AmazonProvider implements IAmazonProvider {
  constructor(private sdlDataWallet: ISdlDataWallet) {}
  getInitializationURL(): ResultAsync<URLString, unknown> {
    const url = URLString(
      "https://www.amazon.com/gp/css/order-history?ie=UTF8&ref_=nav_AccountFlyout_orders",
    );
    return okAsync(url);
  }
}
