//@ts-ignore
import { ESocialType, ISdlDataWallet } from "@snickerdoodlelabs/objects";

import DiscordIcon from "@extension-onboarding/assets/icons/discord.svg";
import TwitterIcon from "@extension-onboarding/assets/icons/twitter.svg";
import {
  DiscordProvider,
  TwitterProvider,
} from "@extension-onboarding/services/socialMediaProviders/implementations";
import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";
export interface ISocialMediaWrapper {
  provider: ISocialMediaProvider;
  icon: any;
  name: string;
  key: ESocialType;
}

export const getProviderList = (
  sdlDataWallet: ISdlDataWallet,
): ISocialMediaWrapper[] => [
  {
    provider: new DiscordProvider(sdlDataWallet),
    icon: DiscordIcon,
    name: "Discord Data",
    key: ESocialType.DISCORD,
  },
  // {
  //   provider: new TwitterProvider(sdlDataWallet),
  //   icon: TwitterIcon,
  //   name: "Twitter Data",
  //   key: ESocialType.TWITTER,
  // },
];
