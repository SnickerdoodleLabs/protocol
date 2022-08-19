import { EModalSelectors } from "@extension-onboarding/components/Modals";
import AccountUnlinkingModal from "@extension-onboarding/components/Modals/AccountUnlinkingModal";
import PhantomLinkingSteps from "@extension-onboarding/components/Modals/PhantomLinkingSteps";
import ViewDetailsModal from "@extension-onboarding/components/Modals/ViewDetailsModal";
import React, {
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";

export interface IModal {
  modalSelector: EModalSelectors | null;
  onPrimaryButtonClick: () => void;
  customProps?: any;
}

interface ILayout {
  setLoadingStatus: (loadingStatus: boolean) => void;
  closeModal: () => void;
  setModal: (modalProps: IModal) => void;
  modalState: IModal;
}

const initialModalState: IModal = {
  modalSelector: null,
  onPrimaryButtonClick: () => {},
  customProps: null,
};

const LayoutContext = createContext<ILayout>({} as ILayout);

export const LayoutProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<IModal>(initialModalState);
  const modalComponent = useMemo(() => {
    switch (true) {
      case modalState.modalSelector === EModalSelectors.ACCOUNT_UNLINKED:
        return <AccountUnlinkingModal />;
      case modalState.modalSelector === EModalSelectors.PHANTOM_LINKING_STEPS:
        return <PhantomLinkingSteps />;
      case modalState.modalSelector === EModalSelectors.VIEW_ACCOUNT_DETAILS:
        return <ViewDetailsModal />;
      default:
        return null;
    }
  }, [modalState]);

  const setLoadingStatus = (loadingStatus: boolean) => {
    setIsLoading(loadingStatus);
  };

  const closeModal = () => {
    setModalState(initialModalState);
  };

  const setModal = (modalProps: IModal) => {
    setModalState(modalProps);
  };

  return (
    <LayoutContext.Provider
      value={{ setLoadingStatus, setModal, closeModal, modalState }}
    >
      {modalComponent}
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
