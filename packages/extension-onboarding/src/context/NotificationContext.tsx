import CustomizedAlert, {
  EAlertSeverity,
} from "@extension-onboarding/components/CustomizedAlert";
import VisualAlert from "@extension-onboarding/components/VisualAlert";
import React, {
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

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
  setVisualAlert: (value: boolean, path?: string) => void;
}
const initialAlertState: IAlert = { message: null, severity: null };

const NotificationContext = createContext<INotificationContext>(
  {} as INotificationContext,
);

export const NotificationContextProvider: FC = ({ children }) => {
  const [alert, _setAlert] = useState<IAlert>(initialAlertState);
  const [visualAlert, _setVisualAlert] = useState<IVisualAlert>();

  const setAlert = useCallback((alert: IAlert) => {
    _setAlert(alert);
  }, []);

  const setVisualAlert = useCallback((value: boolean, path?: string) => {
    if (!value) {
      _setVisualAlert(undefined);
    } else {
      _setVisualAlert({ display: true, path });
    }
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
    <NotificationContext.Provider value={{ setAlert, setVisualAlert }}>
      {visualAlert && <VisualAlert />}
      {alertComponent}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
