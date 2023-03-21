import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";

interface IAuthFlowRouteSettings {
  hideSidebar: boolean;
  removeDefaultPadding: boolean;
  bgColor: string;
}

export const authFlowRouteSettings: Partial<
  Record<EPaths, IAuthFlowRouteSettings>
> = {
  [EPaths.REWARDS_SUBSCRIPTION_DETAIL]: {
    hideSidebar: true,
    removeDefaultPadding: true,
    bgColor: "#FAFAFA",
  },
  [EPaths.REWARDS_SUBSCRIPTIONS]: {
    hideSidebar: false,
    removeDefaultPadding: false,
    bgColor: "#FAFAFA",
  },
  [EPaths.MARKETPLACE_CAMPAIGN_DETAIL]: {
    hideSidebar: true,
    removeDefaultPadding: true,
    bgColor: "#FAFAFA",
  },
  [EPaths.MARKETPLACE_TAG_DETAIL]: {
    hideSidebar: false,
    removeDefaultPadding: false,
    bgColor: "#FAFAFA",
  },
  [EPaths.MARKETPLACE_CAMPAIGN_DETAIL_WITH_TAG]: {
    hideSidebar: true,
    removeDefaultPadding: true,
    bgColor: "#FAFAFA",
  },
  [EPaths.MARKETPLACE]: {
    hideSidebar: false,
    removeDefaultPadding: false,
    bgColor: "#FAFAFA",
  },
};
