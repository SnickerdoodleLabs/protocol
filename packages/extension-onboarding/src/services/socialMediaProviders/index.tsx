//@ts-ignore
import DiscordIcon from "@extension-onboarding/assets/icons/discord.svg";
import TwitterIcon from "@extension-onboarding/assets/icons/twitter.svg";
import {
  DiscordProvider,
  TwitterProvider,
} from "@extension-onboarding/services/socialMediaProviders/implementations";
import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";
import { ESocialType } from "@snickerdoodlelabs/objects";
export interface ISocialMediaWrapper {
  provider: ISocialMediaProvider;
  icon: any;
  name: string;
  key: ESocialType;
}

export const getProviderList = (): ISocialMediaWrapper[] => [
  {
    provider: new DiscordProvider(),
    icon: DiscordIcon,
    name: "Discord Data",
    key: ESocialType.DISCORD,
  },
  {
    provider: new TwitterProvider(),
    icon: TwitterIcon,
    name: "Twitter Data",
    key: ESocialType.TWITTER,
  },
];
