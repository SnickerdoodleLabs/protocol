import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";

interface IBreadcumbProperties {
  clickable: boolean;
  displayName: string;
  useAsBackButton?: boolean;
}

export const breadcrumb: Partial<Record<EPaths, IBreadcumbProperties>> = {
  [EPaths.SETTINGS]: {
    clickable: false,
    displayName: "Settings",
  },
  [EPaths.MARKETPLACE]: {
    clickable: true,
    displayName: "Rewards Marketplace",
  },
  [EPaths.REWARDS_SUBSCRIPTIONS]: {
    clickable: true,
    displayName: "Reward Program Subscriptions",
  },
  [EPaths.REWARDS_SUBSCRIPTION_DETAIL]: {
    clickable: true,
    displayName: "Reward Program Details",
    useAsBackButton: true,
  },
  [EPaths.MARKETPLACE_CAMPAIGN_DETAIL]: {
    clickable: true,
    displayName: "Reward Program Details",
    useAsBackButton: true,
  },
  [EPaths.MARKETPLACE_CAMPAIGN_DETAIL_WITH_TAG]: {
    clickable: true,
    displayName: "Reward Program Details",
    useAsBackButton: true,
  },
};
