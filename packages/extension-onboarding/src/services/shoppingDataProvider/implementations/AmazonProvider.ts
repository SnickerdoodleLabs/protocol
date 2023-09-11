/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DiscordGuildProfile,
  DiscordProfile,
  DiscordID,
  URLString,
  ISdlDataWallet,
} from "@snickerdoodlelabs/objects";
import { errAsync, ResultAsync } from "neverthrow";

import { IAmazonProvider } from "../interfaces/IAmazonProvider";

import { IDiscordInitParams } from "@extension-onboarding/services/socialMediaProviders/interfaces";

export class AmazonProvider implements IAmazonProvider {
  constructor(private sdlDataWallet: ISdlDataWallet) {}
}
