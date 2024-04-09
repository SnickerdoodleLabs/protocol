import { Box } from "@material-ui/core";
import { ISdlDataWallet, OAuthURLState } from "@snickerdoodlelabs/objects";
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
    const error = urlSearchParams.get("error");
    if (state) {
      const { provider } = OAuthURLState.getParsedState(state);
      if (code) {
        window?.opener?.postMessage({ code, provider }, "*");
        return <div>All set! You can close this page now.</div>;
      }
      if (error) {
        return <div>Something went wrong, please try again.</div>;
      }
    }
    return (
      <Suspense
        fallback={
          <Box
            width="fill-available"
            height="fill-available"
            bgcolor="rgb(250, 250, 250)"
          />
        }
      >
        <MainContainer proxy={proxy} />
      </Suspense>
    );
  }, []);
  return <>{render}</>;
};

export default memo(App);
