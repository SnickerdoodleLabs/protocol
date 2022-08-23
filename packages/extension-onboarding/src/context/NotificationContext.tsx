import CustomizedAlert, {
  EAlertSeverity,
} from "@extension-onboarding/components/CustomizedAlert";
import React, { FC, createContext, useContext, useState } from "react";

export interface IAlert {
  message: string | null;
  severity: EAlertSeverity | null;
}

interface INotificationContext {
  setAlert: (alert: IAlert) => void;
}
const initialAlertState: IAlert = { message: null, severity: null };

const NotificationContext = createContext<INotificationContext>(
  {} as INotificationContext,
);

export const NotificationContextProvider: FC = ({ children }) => {
  const [alert, _setAlert] = useState<IAlert>(initialAlertState);

  const setAlert = (alert: IAlert) => {
    _setAlert(alert);
  };

  const resetAlert = () => {
    _setAlert(initialAlertState);
  };

  return (
    <NotificationContext.Provider value={{ setAlert }}>
      {alert.message && alert.severity && (
        <CustomizedAlert
          onClose={resetAlert}
          severity={alert.severity}
          message={alert.message}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
