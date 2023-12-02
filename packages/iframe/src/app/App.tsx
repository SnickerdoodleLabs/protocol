import {
  IPaletteOverrides,
  ISnickerdoodleCore,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import { ChildAPI } from "postmate";
import React, { FC, useCallback, useEffect, useState } from "react";

import { InvitationHandler, ConsentPermissions } from "@core-iframe/app/ui";
import {
  IFrameConfig,
  IFrameControlConfig,
  IFrameEvents,
} from "@core-iframe/interfaces/objects";
import { Theme, ThemeProvider } from "@material-ui/core";
import { createThemeWithOverrides } from "@snickerdoodlelabs/shared-components";

interface IAppProps {
  core: ISnickerdoodleCore;
  childApi: ChildAPI;
  events: IFrameEvents;
  config: IFrameControlConfig;
  coreConfig: IFrameConfig;
}

const defaultLightPalette: IPaletteOverrides = {
  primary: "#000",
  primaryContrast: "#FFF",
  button: "#000",
  buttonContrast: "#FFF",
  text: "#212121",
  linkText: "#2795BD",
  background: "#FFF",
  border: "#BDBDBD",
};

const defaultDarkPalette: IPaletteOverrides = {
  primary: `#FFF`,
  primaryContrast: "#212121",
  button: "#FFF",
  buttonContrast: "#212121",
  text: "#FFF",
  linkText: "#FFF",
  background: "#212121",
  border: "#BDBDBD",
};

enum EComponentKey {
  INVITATION_HANDLER = "INVITATION_HANDLER",
  CONSENT_PERMISSIONS = "CONSENT_PERMISSIONS",
}

export const App: FC<IAppProps> = ({
  core,
  childApi,
  events,
  config,
  coreConfig,
}) => {
  const [theme, setTheme] = useState<Theme>(
    createThemeWithOverrides(config.palette ?? defaultLightPalette),
  );
  const [visibleComponent, setVisibleComponent] =
    useState<EComponentKey | null>(null);

  useEffect(() => {
    events.onInvitationDisplayRequested.subscribe();
  }, []);

  const hide = useCallback(() => {
    setVisibleComponent(null);
    childApi.emit("onIframeHideRequested");
  }, []);
  const show = useCallback((componentKey: EComponentKey) => {
    setVisibleComponent(componentKey);
    childApi.emit("onIframeDisplayRequested");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ConsentPermissions
        core={core}
        coreConfig={coreConfig}
        events={events}
        hide={hide}
        show={() => {
          show(EComponentKey.CONSENT_PERMISSIONS);
        }}
        awaitRender={
          !!visibleComponent &&
          visibleComponent != EComponentKey.CONSENT_PERMISSIONS
        }
      />
      <InvitationHandler
        core={core}
        events={events}
        hide={hide}
        awaitRender={
          !!visibleComponent &&
          visibleComponent != EComponentKey.INVITATION_HANDLER
        }
        show={() => {
          show(EComponentKey.INVITATION_HANDLER);
        }}
      />
    </ThemeProvider>
  );
};

export default App;
