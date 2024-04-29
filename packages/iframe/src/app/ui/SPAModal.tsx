import { IFrameEvents } from "@core-iframe/interfaces/objects";
import CloseIcon from "@material-ui/icons/Close";
import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  FC,
  useRef,
  lazy,
  Suspense,
} from "react";
import { Subscription } from "rxjs";
const LazyModalContainer = lazy(() =>
  import("@snickerdoodlelabs/shared-components").then((module) => ({
    default: module.ModalContainer,
  })),
);
const LazySPA = lazy(() => import("@snickerdoodlelabs/extension-onboarding"));

interface ISPAModalProps {
  proxy: ISdlDataWallet;
  hide: () => void;
  show: () => void;
  events: IFrameEvents;
  awaitRender: boolean;
}

enum EAPP_STATE {
  IDLE,
  VISIBLE,
}

export const SPAModal: FC<ISPAModalProps> = ({
  proxy,
  hide,
  show,
  events,
  awaitRender,
}) => {
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.IDLE);
  const diplayRequestEventRef = useRef<Subscription | null>(null);

  useEffect(() => {
    diplayRequestEventRef.current =
      events.onDashboardViewRequested.subscribe(onDisplayRequest);
    return () => {
      diplayRequestEventRef.current?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (appState === EAPP_STATE.IDLE) {
      hide();
    }
    if (appState === EAPP_STATE.VISIBLE) {
      show();
    }
  }, [appState]);

  const onDisplayRequest = useCallback(() => {
    setAppState(EAPP_STATE.VISIBLE);
  }, []);

  const onClose = useCallback(() => {
    setAppState(EAPP_STATE.IDLE);
  }, []);

  const component = useMemo(() => {
    if (appState === EAPP_STATE.VISIBLE && !awaitRender) {
      return (
        <div
          style={{
            boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
            borderRadius: 12,
            margin: "auto",
            width: "100%",
            height: "90vh",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              margin: "auto",
              top: -20,
              right: -20,
              zIndex: 1,
            }}
          >
            <CloseIcon
              onClick={() => {
                onClose();
              }}
              fontSize="large"
              style={{ cursor: "pointer", color: "#000" }}
            />
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "auto",
            }}
          >
            <Suspense
              fallback={
                <div
                  style={{
                    width: "fill-available",
                    height: "fill-available",
                    backgroundColor: "rgb(250, 250, 250)",
                  }}
                />
              }
            >
              <LazySPA proxy={proxy} />
            </Suspense>
          </div>
        </div>
      );
    }
    return null;
  }, [awaitRender, appState]);

  return (
    <>
      {component && (
        <Suspense fallback={null}>
          <LazyModalContainer allowOverflow>{component}</LazyModalContainer>
        </Suspense>
      )}
    </>
  );
};
