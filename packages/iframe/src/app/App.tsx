import { InvitationHandler } from "@core-iframe/app/ui";
import {
  IFrameControlConfig,
  IFrameEvents,
} from "@core-iframe/interfaces/objects";
import { ISnickerdoodleCore, LanguageCode } from "@snickerdoodlelabs/objects";
import { ChildAPI } from "postmate";
import React, { FC, useEffect } from "react";

interface IAppProps {
  core: ISnickerdoodleCore;
  childApi: ChildAPI;
  events: IFrameEvents;
  config: IFrameControlConfig;
}

const App: FC<IAppProps> = ({ core, childApi, events, config }) => {
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
      />
    </>
  );
};

export default App;
