import LoadingSpinner from "@extension-onboarding/components/LoadingSpinner";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import AccountUnlinkingModal from "@extension-onboarding/components/Modals/AccountUnlinkingModal";
import ConfirmationModal from "@extension-onboarding/components/Modals/ConfirmationModal";
import CustomizableModal from "@extension-onboarding/components/Modals/CustomizableModal";
import DataPermissionsModal from "@extension-onboarding/components/Modals/DataPermissionsModal";
import LeaveCohortModal from "@extension-onboarding/components/Modals/LeaveCohortModal";
import PermissionSelectionModal from "@extension-onboarding/components/Modals/PermissionSelectionModal";
import PhantomLinkingSteps from "@extension-onboarding/components/Modals/PhantomLinkingSteps";
import RewardDetailModal from "@extension-onboarding/components/Modals/RewardDetailModal";
import SubscriptionConfirmationModal from "@extension-onboarding/components/Modals/SubscriptionConfirmationModal";
import SubscriptionSuccessModal from "@extension-onboarding/components/Modals/SubscriptionSuccessModal";
import ViewDetailsModal from "@extension-onboarding/components/Modals/ViewDetailsModal";
import React, {
  ReactNode,
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
  COMPONENT,
}
export interface ILoaderInfo {
  type: ELoadingIndicatorType;
  file?: string;
  component?: ReactNode;
}

interface ILayout {
  setLoadingStatus: (loadingStatus: boolean, loadingInfo?: ILoaderInfo) => void;
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
      case modalState.modalSelector === EModalSelectors.CONFIRMATION_MODAL:
        return <ConfirmationModal />;
      case modalState.modalSelector === EModalSelectors.LEAVE_COHORT_MODAL:
        return <LeaveCohortModal />;
      case modalState.modalSelector ===
        EModalSelectors.SUBSCRIPTION_SUCCESS_MODAL:
        return <SubscriptionSuccessModal />;
      case modalState.modalSelector ===
        EModalSelectors.SUBSCRIPTION_CONFIRMATION_MODAL:
        return <SubscriptionConfirmationModal />;
      case modalState.modalSelector === EModalSelectors.REWARD_DETAIL_MODAL:
        return <RewardDetailModal />;
      case modalState.modalSelector === EModalSelectors.CUSTOMIZABLE_MODAL:
        return (
          <CustomizableModal
            title={modalState?.customProps?.title}
            message={modalState?.customProps?.message}
            primaryButtonText={modalState?.customProps?.primaryButtonText}
            secondaryButtonText={modalState?.customProps?.secondaryButtonText}
          />
        );
      case modalState.modalSelector === EModalSelectors.PERMISSION_SELECTION:
        return <PermissionSelectionModal />;
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
    loadingInfo?: ILoaderInfo,
  ) => {
    if (!loadingStatus) {
      setLoaderInfo(undefined);
    } else {
      setLoaderInfo(loadingInfo ?? { type: ELoadingIndicatorType.DEFAULT });
    }
    // setIsLoading(loadingStatus);
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
