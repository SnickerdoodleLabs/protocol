import LoadingSpinner from "@extension-onboarding/components/LoadingSpinner";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import AirdropDetailModal, {
  IAirdropDetailModal,
} from "@extension-onboarding/components/Modals/V2/AirdropDetailModal";
import ConfirmationModal, {
  IConfirmationModal,
} from "@extension-onboarding/components/Modals/V2/ConfirmationModal";
import LeaveAudienceModal from "@extension-onboarding/components/Modals/V2/LeaveAudienceModal";
import NFTDetailModal, {
  INFTDetailModal,
} from "@extension-onboarding/components/Modals/V2/NFTDetailModal";
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

type ModalSelectorTypeMap = {
  [EModalSelectors.AIRDROP_DETAIL_MODAL]: IAirdropDetailModal;
  [EModalSelectors.CONFIRMATION_MODAL]: IConfirmationModal;
  [EModalSelectors.OTP_MODAL]: IOTPModal;
  [EModalSelectors.NFT_DETAIL_MODAL]: INFTDetailModal;
  [EModalSelectors.LEAVE_AUDIENCE_MODAL]: undefined;
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
      case modalState.modalSelector === EModalSelectors.CONFIRMATION_MODAL:
        return <ConfirmationModal />;
      case modalState.modalSelector === EModalSelectors.AIRDROP_DETAIL_MODAL:
        return <AirdropDetailModal />;
      case modalState.modalSelector === EModalSelectors.LEAVE_AUDIENCE_MODAL:
        return <LeaveAudienceModal />;
      case modalState.modalSelector === EModalSelectors.OTP_MODAL:
        return <OTPModal />;
      case modalState.modalSelector === EModalSelectors.NFT_DETAIL_MODAL:
        return <NFTDetailModal />;
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
