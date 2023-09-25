import { InvitationHandler } from "@core-iframe/app/ui";
import { CoreListenerEvents } from "@core-iframe/implementations/objects/CoreListenerEvents";
import { ISnickerdoodleCore, LanguageCode } from "@snickerdoodlelabs/objects";
import { ChildAPI } from "postmate";
import React, { FC, useEffect } from "react";

interface IAppProps {
  core: ISnickerdoodleCore;
  childApi: ChildAPI;
  events: CoreListenerEvents;
}

const App: FC<IAppProps> = ({ core, childApi, events }) => {
  const hide = () => childApi.emit("onIframeHideRequested");
  const show = () => childApi.emit("onIframeDisplayRequested");

  return (
    <>
      <InvitationHandler core={core} events={events} hide={hide} show={show} />
    </>
  );
};

export default App;
