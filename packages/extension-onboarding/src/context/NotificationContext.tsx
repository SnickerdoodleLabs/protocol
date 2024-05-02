import React, {
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";

import CustomizedAlert, {
  EAlertSeverity,
} from "@extension-onboarding/components/CustomizedAlert";

export interface IAlert {
  message: string | null;
  severity: EAlertSeverity | null;
}

export interface IVisualAlert {
  display: boolean;
  path?: string;
}
interface INotificationContext {
  setAlert: (alert: IAlert) => void;
}
const initialAlertState: IAlert = { message: null, severity: null };

const NotificationContext = createContext<INotificationContext>(
  {} as INotificationContext,
);

export const NotificationContextProvider: FC = memo(({ children }) => {
  const [alert, _setAlert] = useState<IAlert>(initialAlertState);
  const setAlert = useCallback((alert: IAlert) => {
    _setAlert(alert);
  }, []);

  const alertComponent = useMemo(() => {
    if (alert.message && alert.severity) {
      return (
        <CustomizedAlert
          onClose={() => _setAlert(initialAlertState)}
          severity={alert.severity}
          message={alert.message}
        />
      );
    }
    return null;
  }, [JSON.stringify(alert)]);

  return (
    <NotificationContext.Provider value={{ setAlert }}>
      {alertComponent}
      {children}
    </NotificationContext.Provider>
  );
});

export const useNotificationContext = () => useContext(NotificationContext);
