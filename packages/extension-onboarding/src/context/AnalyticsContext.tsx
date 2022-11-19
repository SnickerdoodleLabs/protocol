import { AnalyticsConfigProvider } from "@extension-onboarding/services/implementations/AnalyticsConfigProvider";
import { AnalyticsConfig } from "@extension-onboarding/services/interfaces/objects/AnalyticsConfig";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import ReactGA from "react-ga";
import { hotjar } from "react-hotjar";

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

export const AnalyticsContextProvider: FC = ({ children }) => {
  useEffect(() => {
    initializeAnalyticTools();
  }, []);

  const initializeAnalyticTools = () => {
    ReactGA.initialize(config.gaTrackingId);
    hotjar.initialize(config.hjId, config.hjSv);
  };

  const sendEvent = useCallback(
    (
      action,
      category = EEventCategory.DEFAULT,
      label = EEventLabel.DEFAULT,
    ) => {
      ReactGA.event({ category, action, label });
    },
    [],
  );
  const sendPageView = useCallback(() => {
    ReactGA.pageview(window.location.href);
  }, []);

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
};

export const useAnalyticsContext = () => useContext(AnalyticsContext);
