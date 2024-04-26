import LoadingSpinner from "@extension-onboarding/components/LoadingSpinner";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { IAirdropDetailModal } from "@extension-onboarding/components/Modals/V2/AirdropDetailModal";
import { IAnsweredQuestionnaireModal } from "@extension-onboarding/components/Modals/V2/AnsweredQuestionnaireModal";
import { IBrandPermissionsModal } from "@extension-onboarding/components/Modals/V2/BrandPermissionsModal";
import { IConfirmationModal } from "@extension-onboarding/components/Modals/V2/ConfirmationModal";
import { INFTDetailModal } from "@extension-onboarding/components/Modals/V2/NFTDetailModal";
import { IOfferModal } from "@extension-onboarding/components/Modals/V2/OfferModal";
import { IOTPModal } from "@extension-onboarding/components/Modals/V2/OTPModal";
import { IQuestionnaireModal } from "@extension-onboarding/components/Modals/V2/QuestionnaireModal";
import { IShareQuestionnaireModal } from "@extension-onboarding/components/Modals/V2/ShareQuestionnaireModal";
import { useSafeState } from "@snickerdoodlelabs/shared-components";
import React, {
  ReactNode,
  FC,
  createContext,
  useContext,
  useMemo,
  useEffect,
  memo,
  lazy,
  Suspense,
} from "react";

const LazyQuestionnaireModal = lazy(
  () => import("@extension-onboarding/components/Modals/V2/QuestionnaireModal"),
);
const LazyAnsweredQuestionnaireModal = lazy(
  () =>
    import(
      "@extension-onboarding/components/Modals/V2/AnsweredQuestionnaireModal"
    ),
);

const LazyNftDetailModal = lazy(
  () => import("@extension-onboarding/components/Modals/V2/NFTDetailModal"),
);

const LazyOfferModal = lazy(
  () => import("@extension-onboarding/components/Modals/V2/OfferModal"),
);

const LazyShareQuestionnaireModal = lazy(
  () =>
    import(
      "@extension-onboarding/components/Modals/V2/ShareQuestionnaireModal"
    ),
);

const LazyAirdropDetailModal = lazy(
  () => import("@extension-onboarding/components/Modals/V2/AirdropDetailModal"),
);
const LazyOtpModal = lazy(
  () => import("@extension-onboarding/components/Modals/V2/OTPModal"),
);

const LazyConfirmationModal = lazy(
  () => import("@extension-onboarding/components/Modals/V2/ConfirmationModal"),
);

const LazyBrandPermissionsModal = lazy(
  () =>
    import("@extension-onboarding/components/Modals/V2/BrandPermissionsModal"),
);

type ModalSelectorTypeMap = {
  [EModalSelectors.AIRDROP_DETAIL_MODAL]: IAirdropDetailModal;
  [EModalSelectors.CONFIRMATION_MODAL]: IConfirmationModal;
  [EModalSelectors.OTP_MODAL]: IOTPModal;
  [EModalSelectors.NFT_DETAIL_MODAL]: INFTDetailModal;
  [EModalSelectors.QUESTIONNAIRE_MODAL]: IQuestionnaireModal;
  [EModalSelectors.ANSWERED_QUESTIONNAIRE_MODAL]: IAnsweredQuestionnaireModal;
  [EModalSelectors.BRAND_PERMISSIONS_MODAL]: IBrandPermissionsModal;
  [EModalSelectors.OFFER_MODAL]: IOfferModal;
  [EModalSelectors.SHARE_QUESTIONNAIRE_MODAL]: IShareQuestionnaireModal;
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

export const LayoutProvider: FC = memo(({ children }) => {
  const [isLoading, setIsLoading] = useSafeState<boolean>(false);
  const [loaderInfo, setLoaderInfo] = useSafeState<ILoaderInfo>();
  const [modalState, setModalState] = useSafeState<IModal<ModalSelector>>(
    initialModalState as IModal<keyof ModalSelectorTypeMap>,
  );
  const modalComponent = useMemo(() => {
    switch (true) {
      case modalState.modalSelector === EModalSelectors.CONFIRMATION_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyConfirmationModal />
          </Suspense>
        );
      case modalState.modalSelector === EModalSelectors.AIRDROP_DETAIL_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyAirdropDetailModal />
          </Suspense>
        );
      case modalState.modalSelector === EModalSelectors.OTP_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyOtpModal />
          </Suspense>
        );
      case modalState.modalSelector === EModalSelectors.NFT_DETAIL_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyNftDetailModal />
          </Suspense>
        );
      case modalState.modalSelector === EModalSelectors.QUESTIONNAIRE_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyQuestionnaireModal />
          </Suspense>
        );
      case modalState.modalSelector ===
        EModalSelectors.ANSWERED_QUESTIONNAIRE_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyAnsweredQuestionnaireModal />
          </Suspense>
        );
      case modalState.modalSelector === EModalSelectors.BRAND_PERMISSIONS_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyBrandPermissionsModal />
          </Suspense>
        );
      case modalState.modalSelector === EModalSelectors.OFFER_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyOfferModal />
          </Suspense>
        );
      case modalState.modalSelector ===
        EModalSelectors.SHARE_QUESTIONNAIRE_MODAL:
        return (
          <Suspense fallback={null}>
            <LazyShareQuestionnaireModal />
          </Suspense>
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
});

export const useLayoutContext = () => useContext(LayoutContext);
