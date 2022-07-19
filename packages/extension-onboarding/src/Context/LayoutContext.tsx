import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import CustomizedAlert, {
  EAlertSeverity,
} from "@extension-onboarding/components/CustomizedAlert";
import AccountUnlinkingModal from "@extension-onboarding/components/Modals/AccountUnlinkingModal";
import PhantomLinkingSteps from "@extension-onboarding/components/Modals/PhantomLinkingSteps";
import { EModalSelectors } from "@extension-onboarding/components/Modals";

export interface IAlert {
  message: string | null;
  severity: EAlertSeverity | null;
}
export interface IModal {
  modalSelector: EModalSelectors | null;
  onPrimaryButtonClick: () => void;
  customProps?: any;
}

interface ILayout {
  setLoadingStatus: (loadingStatus: boolean) => void;
  setAlert: (alert: IAlert) => void;
  closeModal: () => void;
  setModal: (modalProps: IModal) => void;
  modalState: IModal;
}
const initialAlertState: IAlert = { message: null, severity: null };

const initialModalState: IModal = {
  modalSelector: null,
  onPrimaryButtonClick: () => {},
  customProps: null,
};

const LayoutContext = createContext<ILayout>({} as ILayout);

export const LayoutProvider: FC = ({ children }) => {
  const [alert, _setAlert] = useState<IAlert>(initialAlertState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [modalState, setModalState] = useState<IModal>(initialModalState);

  const modalComponent = useMemo(() => {
    switch (true) {
      case modalState.modalSelector === EModalSelectors.ACCOUNT_UNLINKED:
        return <AccountUnlinkingModal />;
      case modalState.modalSelector === EModalSelectors.PHANTOM_LINKING_STEPS:
        return <PhantomLinkingSteps />;

      default:
        return null;
    }
  }, [modalState]);

  const setAlert = (alert: IAlert) => {
    _setAlert(alert);
  };

  const setLoadingStatus = (loadingStatus: boolean) => {
    setIsLoading(loadingStatus);
  };

  const resetAlert = () => {
    _setAlert(initialAlertState);
  };

  const closeModal = () => {
    setModalState(initialModalState);
  };

  const setModal = (modalProps: IModal) => {
    setModalState(modalProps);
  };

  return (
    <LayoutContext.Provider
      value={{ setAlert, setLoadingStatus, setModal, closeModal, modalState }}
    >
      {modalComponent}
      {alert.message && alert.severity && (
        <CustomizedAlert
          onClose={resetAlert}
          severity={alert.severity}
          message={alert.message}
        />
      )}
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
