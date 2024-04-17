import { InvitationHandler, SPAModal } from "@core-iframe/app/ui";
import {
  IFrameConfig,
  IFrameControlConfig,
  IFrameEvents,
} from "@core-iframe/interfaces/objects";
import { ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import { ChildAPI } from "postmate";
import React, { FC, useCallback, useState } from "react";
import { IProxyBridge } from "@core-iframe/interfaces/IProxyBridge";

enum EComponentKey {
  INVITATION_HANDLER = "INVITATION_HANDLER",
  SPA = "SPA",
}

interface IAppProps {
  core: ISnickerdoodleCore;
  proxy: IProxyBridge;
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
  const [visibleComponent, setVisibleComponent] =
    useState<EComponentKey | null>(null);
  const hide = useCallback(() => {
    setVisibleComponent(null);
    childApi.emit("onIframeHideRequested");
  }, []);

  const show = useCallback((componentKey: EComponentKey) => {
    setVisibleComponent(componentKey);
    childApi.emit("onIframeDisplayRequested");
  }, []);

  const requestLinkAccount = useCallback(() => {
    childApi.emit("onLinkAccountRequested");
    proxy.requestLinkAccount();
  }, []);

  return (
    <>
      <SPAModal
        proxy={proxy}
        hide={() => {
          visibleComponent === EComponentKey.SPA && hide();
        }}
        events={events}
        show={() => {
          !visibleComponent && show(EComponentKey.SPA);
        }}
        awaitRender={
          !!visibleComponent && visibleComponent != EComponentKey.SPA
        }
      />
      <InvitationHandler
        requestLinkAccount={requestLinkAccount}
        core={core}
        events={events}
        hide={() => {
          visibleComponent === EComponentKey.INVITATION_HANDLER && hide();
        }}
        show={() => {
          !visibleComponent && show(EComponentKey.INVITATION_HANDLER);
        }}
        config={config}
        awaitRender={
          !!visibleComponent &&
          visibleComponent != EComponentKey.INVITATION_HANDLER
        }
        coreConfig={coreConfig}
      />
    </>
  );
};

export default App;
