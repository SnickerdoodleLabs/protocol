import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";

interface IBreadcumbProperties {
  clickable: boolean;
  displayName: string;
}

export const breadcrumb: Partial<Record<EPaths, IBreadcumbProperties>> = {
  [EPaths.SETTINGS]: {
    clickable: false,
    displayName: "Settings",
  },
  [EPaths.REWARDS_SUBSCRIPTIONS]: {
    clickable: true,
    displayName: "Reward Program Subscriptions",
  },
};
