import LoadingSpinner from "@extension-onboarding/components/LoadingSpinner";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import AccountUnlinkingModal from "@extension-onboarding/components/Modals/AccountUnlinkingModal";
import ConfirmationModal from "@extension-onboarding/components/Modals/ConfirmationModal";
import CustomizableModal from "@extension-onboarding/components/Modals/CustomizableModal";
import DataPermissionsModal from "@extension-onboarding/components/Modals/DataPermissionsModal";
import PermissionSelectionModal from "@extension-onboarding/components/Modals/PermissionSelectionModal";
import PhantomLinkingSteps from "@extension-onboarding/components/Modals/PhantomLinkingSteps";
import ViewDetailsModal from "@extension-onboarding/components/Modals/ViewDetailsModal";
import React, {
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

export interface IModal {
  modalSelector: EModalSelectors | null;
  onPrimaryButtonClick: (params?: any) => void;
  customProps?: any;
}

export enum ELoadingIndicatorType {
  DEFAULT,
  LOTTIE,
}
export interface ILoaderInfo {
  type: ELoadingIndicatorType;
  file?: string;
}

interface ILayout {
  setLoadingStatus: (
    loadingStatus: boolean,
    type?: ELoadingIndicatorType,
    file?: string,
  ) => void;
  closeModal: () => void;
  setModal: (modalProps: IModal) => void;
  modalState: IModal;
  loading: boolean;
  loaderInfo: ILoaderInfo | undefined;
}

const initialModalState: IModal = {
  modalSelector: null,
  onPrimaryButtonClick: () => {},
  customProps: null,
};

const LayoutContext = createContext<ILayout>({} as ILayout);

export const LayoutProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loaderInfo, setLoaderInfo] = useState<ILoaderInfo>();
  const [modalState, setModalState] = useState<IModal>(initialModalState);
  const modalComponent = useMemo(() => {
    switch (true) {
      case modalState.modalSelector === EModalSelectors.ACCOUNT_UNLINKED:
        return <AccountUnlinkingModal />;
      case modalState.modalSelector === EModalSelectors.PHANTOM_LINKING_STEPS:
        return <PhantomLinkingSteps />;
      case modalState.modalSelector === EModalSelectors.VIEW_ACCOUNT_DETAILS:
        return <ViewDetailsModal />;
      case modalState.modalSelector === EModalSelectors.MANAGE_PERMISSIONS:
        return <DataPermissionsModal />;
      case modalState.modalSelector === EModalSelectors.PERMISSION_SELECTION:
        return <PermissionSelectionModal />;
      case modalState.modalSelector === EModalSelectors.CONFIRMATION_MODAL:
        return <ConfirmationModal />;
      case modalState.modalSelector === EModalSelectors.CUSTOMIZABLE_MODAL:
        return (
          <CustomizableModal
            title={modalState?.customProps?.title}
            message={modalState?.customProps?.message}
            primaryButtonText={modalState?.customProps?.primaryButtonText}
            secondaryButtonText={modalState?.customProps?.secondaryButtonText}
          />
        );
      default:
        return null;
    }
  }, [modalState]);

  useEffect(() => {
    if (loaderInfo) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [JSON.stringify(loaderInfo)]);

  const setLoadingStatus = (
    loadingStatus: boolean,
    type?: ELoadingIndicatorType,
    file?: string,
  ) => {
    if (!loadingStatus) {
      setLoaderInfo(undefined);
    } else {
      setLoaderInfo({ type: type ?? ELoadingIndicatorType.DEFAULT, file });
    }
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
      value={{
        setLoadingStatus,
        setModal,
        closeModal,
        modalState,
        loading: isLoading,
        loaderInfo,
      }}
    >
      <LoadingSpinner />
      {modalComponent}
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
