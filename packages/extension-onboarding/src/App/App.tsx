import MainContainer from "@extension-onboarding/containers/MainContainer";
import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import React, { FC, memo } from "react";

interface IAppProps {
  proxy?: ISdlDataWallet;
}

const App: FC<IAppProps> = ({ proxy }) => <MainContainer proxy={proxy} />;

export default memo(App);
