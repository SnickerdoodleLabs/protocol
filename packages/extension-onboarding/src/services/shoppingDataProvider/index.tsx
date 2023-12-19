import { EKnownDomains } from "@snickerdoodlelabs/objects";

export interface IShoppingDataWrapper {
  icon: string;
  name: string;
  key: EKnownDomains;
}

export const getProviderList = (): IShoppingDataWrapper[] => [
  {
    icon: "https://storage.googleapis.com/dw-assets/spa/images/amazon-logo.png",
    name: "Amazon",
    key: EKnownDomains.Amazon,
  },
];
