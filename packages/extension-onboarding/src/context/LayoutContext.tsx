import LoadingSpinner from "@extension-onboarding/components/LoadingSpinner";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import AccountUnlinkingModal from "@extension-onboarding/components/Modals/AccountUnlinkingModal";
import ConfirmationModal from "@extension-onboarding/components/Modals/ConfirmationModal";
import CustomizableModal from "@extension-onboarding/components/Modals/CustomizableModal";
import PhantomLinkingSteps from "@extension-onboarding/components/Modals/PhantomLinkingSteps";
import RewardDetailModal from "@extension-onboarding/components/Modals/RewardDetailModal";
import SuiLinkingSteps from "@extension-onboarding/components/Modals/SuiLinkingSteps";
import LeaveAudienceModal from "@extension-onboarding/components/Modals/V2/LeaveAudienceModal";
import OTPModal, {
  IOTPModal,
} from "@extension-onboarding/components/Modals/V2/OTPModal";
import React, {
  ReactNode,
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
// under construction
type ModalSelectorTypeMap = {
  [EModalSelectors.ACCOUNT_UNLINKED]: any;
  [EModalSelectors.PHANTOM_LINKING_STEPS]: any;
  [EModalSelectors.CONFIRMATION_MODAL]: any;
  [EModalSelectors.REWARD_DETAIL_MODAL]: any;
  [EModalSelectors.CUSTOMIZABLE_MODAL]: any;
  [EModalSelectors.OTP_MODAL]: IOTPModal;
  [EModalSelectors.LEAVE_AUDIENCE_MODAL]: undefined;
  [EModalSelectors.SUI_LINKING_STEPS]: any;
};

type ModalSelector = keyof ModalSelectorTypeMap;

export interface IModal<T extends keyof ModalSelectorTypeMap | null> {
  modalSelector: T;
  onPrimaryButtonClick: (params?: any) => void;
  customProps?: T extends keyof ModalSelectorTypeMap
    ? ModalSelectorTypeMap[T]
    : null;
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
  setModal: <T extends ModalSelector | null = null>(
    modalProps: IModal<T>,
  ) => void;
  modalState: IModal<ModalSelector>;
  loading: boolean;
  loaderInfo: ILoaderInfo | undefined;
}

const initialModalState: IModal<keyof ModalSelectorTypeMap | null> = {
  modalSelector: null,
  onPrimaryButtonClick: () => {},
  customProps: null,
} as IModal<keyof ModalSelectorTypeMap | null>;

const LayoutContext = createContext<ILayout>({} as ILayout);

export const LayoutProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loaderInfo, setLoaderInfo] = useState<ILoaderInfo>();
  const [modalState, setModalState] = useState<IModal<ModalSelector>>(
    initialModalState as IModal<keyof ModalSelectorTypeMap>,
  );
  const modalComponent = useMemo(() => {
    switch (true) {
      case modalState.modalSelector === EModalSelectors.ACCOUNT_UNLINKED:
        return <AccountUnlinkingModal />;
      case modalState.modalSelector === EModalSelectors.PHANTOM_LINKING_STEPS:
        return <PhantomLinkingSteps />;
      case modalState.modalSelector === EModalSelectors.SUI_LINKING_STEPS:
        return <SuiLinkingSteps />;
      case modalState.modalSelector === EModalSelectors.CONFIRMATION_MODAL:
        return <ConfirmationModal />;
      case modalState.modalSelector === EModalSelectors.LEAVE_AUDIENCE_MODAL:
        return <LeaveAudienceModal />;
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
      case modalState.modalSelector === EModalSelectors.OTP_MODAL:
        return <OTPModal />;
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
    setModalState(initialModalState as IModal<keyof ModalSelectorTypeMap>);
  };

  const setModal = <T extends ModalSelector | null = null>(
    modalProps: IModal<T>,
  ) => {
    setModalState(modalProps as IModal<ModalSelector>);
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
