import { IFrameEvents } from "@core-iframe/interfaces/objects";
import { Box } from "@material-ui/core";
import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import {
  CloseButton,
  ModalContainer,
} from "@snickerdoodlelabs/shared-components";
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

  const onDisplayRequest = useCallback(() => {
    setAppState(EAPP_STATE.VISIBLE);
    show();
  }, []);

  const onClose = useCallback(() => {
    setAppState(EAPP_STATE.IDLE);
    hide();
  }, []);

  const component = useMemo(() => {
    if (appState === EAPP_STATE.VISIBLE && !awaitRender) {
      return (
        <Box
          boxShadow="rgb(38, 57, 77) 0px 20px 30px -10px"
          borderRadius={12}
          overflow="auto"
          margin="auto"
          width="100%"
          maxHeight="90vh"
          position="relative"
        >
          <Box
            width={40}
            height={40}
            bgcolor={"#00000066"}
            borderRadius={10}
            display="flex"
            pl={-3}
            alignContent="ceter"
            justifyContent="center"
            position="absolute"
            mx="auto"
            top={5}
            left={120}
            zIndex={1}
          >
            <Box ml={-3}>
              <CloseButton color="#fff" size={36} onClick={onClose} />
            </Box>
          </Box>
          <Suspense fallback={<div>Loading...</div>}>
            <LazySPA proxy={proxy} />
          </Suspense>
        </Box>
      );
    }
    return null;
  }, [awaitRender, appState]);

  return <>{component && <ModalContainer>{component}</ModalContainer>}</>;
};
