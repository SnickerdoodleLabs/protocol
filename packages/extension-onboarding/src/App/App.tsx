import {
  EOAuthRequestSource,
  ISdlDataWallet,
  OAuthURLState,
} from "@snickerdoodlelabs/objects";
import React, { FC, useMemo, memo, lazy, Suspense } from "react";
const MainContainer = lazy(
  () => import("@extension-onboarding/containers/MainContainer"),
);

interface IAppProps {
  proxy?: ISdlDataWallet;
}

const App: FC<IAppProps> = ({ proxy }) => {
  // thanks to lazy loading, we don't need to load the whole app if we don't need to
  // now tha app became multi talented app that can be used for couple of things
  // it can initiate the snickerdoodle web integration
  // it can work with the snickerdoodle extension
  // it can be used for getting the oauth code which is not allowed to be used in the iframe
  // this app also can be used as a standalone app or as a component in the iframe implementation
  const render = useMemo(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get("code");
    const state = urlSearchParams.get("state");
    if (code && state) {
      const { provider, requestSource } = OAuthURLState.getParsedState(state);
      if (requestSource === EOAuthRequestSource.IFRAME) {
        window?.opener?.postMessage({ code, provider }, "*");
        return <div>All set! You can close this page now.</div>;
      }
    }
    return (
      <Suspense fallback={null}>
        <MainContainer proxy={proxy} />;
      </Suspense>
    );
  }, []);
  return <>{render}</>;
};

export default memo(App);
