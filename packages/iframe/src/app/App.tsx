import {
  ISdlDataWallet,
  ISnickerdoodleCore,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import SPA from "@snickerdoodlelabs/extension-onboarding";
import { ChildAPI } from "postmate";
import React, { FC, useEffect } from "react";

import { InvitationHandler } from "@core-iframe/app/ui";
import {
  IFrameConfig,
  IFrameControlConfig,
  IFrameEvents,
} from "@core-iframe/interfaces/objects";
import { Box } from "@material-ui/core";
import {
  CloseButton,
  ModalContainer,
} from "@snickerdoodlelabs/shared-components";

interface IAppProps {
  core: ISnickerdoodleCore;
  proxy: ISdlDataWallet;
  childApi: ChildAPI;
  events: IFrameEvents;
  config: IFrameControlConfig;
  coreConfig: IFrameConfig;
}

const App: FC<IAppProps> = ({
  core,
  childApi,
  events,
  config,
  coreConfig,
  proxy,
}) => {
  const hide = () => childApi.emit("onIframeHideRequested");
  const show = () => childApi.emit("onIframeDisplayRequested");
  setTimeout(() => {
    show();
  }, 5000);
  console.log(document, "document");
  return (
    <>
      <ModalContainer>
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
              <CloseButton color="#fff" size={36} onClick={hide} />
            </Box>
          </Box>
          <SPA proxy={proxy} />
        </Box>
      </ModalContainer>
      <InvitationHandler
        core={core}
        events={events}
        hide={hide}
        show={show}
        config={config}
        coreConfig={coreConfig}
      />
    </>
  );
};

export default App;
