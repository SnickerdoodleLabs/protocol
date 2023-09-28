import { useStyles } from "@core-iframe/components/App.style";
import {
  IConfigProvider,
  IIFrameContextProvider,
} from "@core-iframe/interfaces/utilities";
import { Box } from "@material-ui/core";
import { ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import { ChildAPI } from "postmate";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Subscription } from "rxjs";

import { StorageHandler } from "./StorageAccessHandler";

interface IAppProps {
  childApi: ChildAPI;
  configProvider: IConfigProvider;
  contextProvider: IIFrameContextProvider;
}
const App: FC<IAppProps> = ({ childApi, configProvider, contextProvider }) => {
  const classes = useStyles();
  const [_core, _setCore] = useState<ISnickerdoodleCore>();
  const [storageHandled, setStorageHandled] = useState<boolean>(false);
  const corePromiseSubscription = useRef<Subscription>();
  const hide = () => childApi.emit("onIframeHideRequested");
  const show = () => childApi.emit("onIframeDisplayRequested");
  const { core, coreConfig, iframeConfig, iframeEvents } = useMemo(() => {
    if (!_core)
      return {
        core: undefined,
        coreConfig: undefined,
        iframeConfig: undefined,
        iframeEvents: contextProvider.getEvents(),
      };
    const coreConfig = configProvider.getConfig();
    const iframeConfig = contextProvider.getConfig();
    return {
      core: _core,
      coreConfig,
      iframeConfig,
      iframeEvents: contextProvider.getEvents(),
    };
  }, [_core]);
  useEffect(() => {
    corePromiseSubscription.current =
      iframeEvents.onCorePromiseResolved.subscribe(corePromiseResolvedHandler);
  }, []);

  useEffect(() => {
    if (storageHandled) {
      iframeEvents.onStorageAccessHandled.next();
    }
  }, [storageHandled]);

  const corePromiseResolvedHandler = (core: ISnickerdoodleCore) => {
    _setCore(core);
    console.log("core initalized");
  };

  return (
    <>
      {!storageHandled && (
        <StorageHandler
          hide={hide}
          show={show}
          callback={() => {
            setStorageHandled(true);
          }}
        />
      )}
      <Box className={classes.appWrapper}>Hello!</Box>
    </>
  );
};

export default App;
