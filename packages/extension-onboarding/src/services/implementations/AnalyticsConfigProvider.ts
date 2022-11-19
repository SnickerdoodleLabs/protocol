import { AnalyticsConfig } from "@extension-onboarding/services/interfaces/objects/AnalyticsConfig";

declare const __GA_TRACKING_ID__: string;
declare const __HJID__: string;
declare const __HJSV__: string;

export class AnalyticsConfigProvider {
  private analyticsConfig: AnalyticsConfig;
  constructor() {
    this.analyticsConfig = new AnalyticsConfig(
      __GA_TRACKING_ID__,
      Number(__HJID__),
      Number(__HJSV__),
    );
  }
  public get config(): AnalyticsConfig {
    return this.analyticsConfig;
  }
}
