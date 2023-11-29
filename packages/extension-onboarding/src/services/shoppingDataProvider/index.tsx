import AmazonIcon from "@extension-onboarding/assets/images/amazon-logo.png";
import { EShoppingDataType } from "@extension-onboarding/objects/enums/EShoppingDataType";
export interface IShoppingDataWrapper {
  icon: any;
  name: string;
  key: EShoppingDataType;
}

export const getProviderList = (): IShoppingDataWrapper[] => [
  {
    icon: AmazonIcon,
    name: "Amazon",
    key: EShoppingDataType.AMAZON,
  },
];
