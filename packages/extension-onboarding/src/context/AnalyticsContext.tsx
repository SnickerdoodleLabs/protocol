import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useCallback,
  memo,
} from "react";
import ReactGA from "react-ga";
import { hotjar } from "react-hotjar";

import { AnalyticsConfigProvider } from "@extension-onboarding/services/implementations/AnalyticsConfigProvider";
import { AnalyticsConfig } from "@extension-onboarding/services/interfaces/objects/AnalyticsConfig";

const config: AnalyticsConfig = new AnalyticsConfigProvider().config;

enum EEventCategory {
  DEFAULT = "SDL DataWallet",
}

enum EEventLabel {
  DEFAULT = "GA",
}

interface IAnalyticsContext {
  sendEvent: (
    action,
    category?: EEventCategory.DEFAULT,
    label?: EEventLabel.DEFAULT,
  ) => void;
  sendPageView: () => void;
  eventCategories: typeof EEventCategory;
  eventLabels: typeof EEventLabel;
}

const AnalyticsContext = createContext<IAnalyticsContext>(
  {} as IAnalyticsContext,
);

interface IAnalyticsContextProviderProps {
  disabled?: boolean;
}

export const AnalyticsContextProvider: FC<IAnalyticsContextProviderProps> =
  memo(({ children, disabled = true }) => {
    useEffect(() => {
      initializeAnalyticTools();
    }, []);

    const initializeAnalyticTools = () => {
      if (disabled) return;
      ReactGA.initialize(config.gaTrackingId);
      hotjar.initialize(config.hotJarId, config.hotJarSv);
    };

    const sendEvent = useCallback(
      (
        action,
        category = EEventCategory.DEFAULT,
        label = EEventLabel.DEFAULT,
      ) => {
        ReactGA.event({ category, action, label });
      },
      [disabled],
    );
    const sendPageView = useCallback(() => {
      if (disabled) return;
      ReactGA.pageview(window.location.href);
    }, [disabled]);

    return (
      <AnalyticsContext.Provider
        value={{
          sendEvent,
          sendPageView,
          eventCategories: EEventCategory,
          eventLabels: EEventLabel,
        }}
      >
        {children}
      </AnalyticsContext.Provider>
    );
  });

export const useAnalyticsContext = () => useContext(AnalyticsContext);
