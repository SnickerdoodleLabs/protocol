import { AnalyticsConfig } from "@extension-onboarding/services/interfaces/objects/AnalyticsConfig";

declare const __GA_TRACKING_ID__: string;
declare const __HOTJAR_ID__: string;
declare const __HOTJAR_SNIPPET_VERSION__: string;

export class AnalyticsConfigProvider {
  private analyticsConfig: AnalyticsConfig;
  constructor() {
    this.analyticsConfig = new AnalyticsConfig(
      __GA_TRACKING_ID__,
      Number(__HOTJAR_ID__),
      Number(__HOTJAR_SNIPPET_VERSION__),
    );
  }
  public get config(): AnalyticsConfig {
    return this.analyticsConfig;
  }
}
