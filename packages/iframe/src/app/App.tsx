import { ISnickerdoodleCore, LanguageCode } from "@snickerdoodlelabs/objects";
import { ChildAPI } from "postmate";
import React, { FC, useEffect } from "react";

import { InvitationHandler } from "@core-iframe/app/ui";
import {
  IFrameConfig,
  IFrameControlConfig,
  IFrameEvents,
} from "@core-iframe/interfaces/objects";

interface IAppProps {
  core: ISnickerdoodleCore;
  childApi: ChildAPI;
  events: IFrameEvents;
  config: IFrameControlConfig;
  coreConfig: IFrameConfig;
}

const App: FC<IAppProps> = ({ core, childApi, events, config, coreConfig }) => {
  const hide = () => childApi.emit("onIframeHideRequested");
  const show = () => childApi.emit("onIframeDisplayRequested");

  return (
    <>
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
