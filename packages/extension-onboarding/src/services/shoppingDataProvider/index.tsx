import { EKnownDomains } from "@snickerdoodlelabs/objects";

import AmazonIcon from "@extension-onboarding/assets/images/amazon-logo.png";
export interface IShoppingDataWrapper {
  icon: string;
  name: string;
  key: EKnownDomains;
}

export const getProviderList = (): IShoppingDataWrapper[] => [
  {
    icon: AmazonIcon,
    name: "Amazon",
    key: EKnownDomains.Amazon,
  },
];
