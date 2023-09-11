import { ISdlDataWallet } from "@snickerdoodlelabs/objects";

import { AmazonProvider } from "./implementations";
import { IShoppingDataProvider } from "./interfaces/IShoppingDataProvider";

import AmazonIcon from "@extension-onboarding/assets/images/amazon-logo.png";
import { EShoppingDataType } from "@extension-onboarding/objects/enums/EShoppingDataType";
import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";
export interface IShoppingDataWrapper {
  provider: IShoppingDataProvider;
  icon: any;
  name: string;
  key: EShoppingDataType;
}

export const getProviderList = (
  sdlDataWallet: ISdlDataWallet,
): IShoppingDataWrapper[] => [
  {
    provider: new AmazonProvider(sdlDataWallet),
    icon: AmazonIcon,
    name: "Amazon",
    key: EShoppingDataType.AMAZON,
  },
];
