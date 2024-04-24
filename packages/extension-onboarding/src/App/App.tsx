import React, { FC, useEffect, useMemo, memo, lazy, Suspense } from "react";
const LazyMainContainer = lazy(
  () => import("@extension-onboarding/containers/MainContainer"),
);

interface IAppProps {
  // this is the proxy object that is passed from the parent component
  // the type of this object should be ISdlDataWallet but we don't want to have objects package imported at this step to avoid initial loading cost
  proxy?: any;
}
enum EState {
  APP_FLOW = "APP_FLOW",
  O_AUTH_ERROR = "O_AUTH_ERROR",
  O_AUTH_SUCCESS = "O_AUTH_SUCCESS",
}

const Loading = () => (
  <div
    style={{
      width: "fill-available",
      height: "fill-available",
      backgroundColor: "rgb(250, 250, 250)",
    }}
  />
);

const App: FC<IAppProps> = ({ proxy }) => {
  // This app can serve multiple purposes:
  // - It can initialize the Snickerdoodle web integration.
  // - It can interact with the Snickerdoodle extension.
  // - It can facilitate obtaining the OAuth code, which is restricted from use within iframes.
  // Additionally, this app can function as both a standalone application and a component within an iframe implementation.
  const [appState, setAppState] = React.useState<EState>();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const state = urlSearchParams.get("state");
    const code = urlSearchParams.get("code");
    const error = urlSearchParams.get("error");

    if (state) {
      if (code) {
        import("@snickerdoodlelabs/objects")
          .then(({ OAuthURLState }) => {
            try {
              const { provider } = OAuthURLState.getParsedState(state);
              window?.opener?.postMessage({ code, provider }, "*");
              setAppState(EState.O_AUTH_SUCCESS);
            } catch (e) {
              setAppState(EState.O_AUTH_ERROR);
            }
          })
          .catch(() => {
            setAppState(EState.O_AUTH_ERROR);
          });
      } else {
        setAppState(EState.O_AUTH_ERROR);
      }
    } else {
      setAppState(EState.APP_FLOW);
    }
  }, []);

  const render = useMemo(() => {
    if (appState == undefined) {
      return <Loading />;
    }

    if (appState === EState.O_AUTH_ERROR) {
      return <div>Something went wrong, please try again.</div>;
    }

    if (appState === EState.O_AUTH_SUCCESS) {
      return <div>All set! You can close this page now.</div>;
    }

    return (
      <Suspense fallback={<Loading />}>
        <LazyMainContainer proxy={proxy} />
      </Suspense>
    );
  }, [appState, proxy]);

  return <>{render}</>;
};

export default memo(App);
