import { ISnickerdoodleIFrameProxy } from "@web-integration/interfaces/proxy/index.js";
import React, { useMemo, useState, useEffect, FC } from "react";

interface IAppProps {
  proxy: ISnickerdoodleIFrameProxy;
}

export const App: FC<IAppProps> = ({ proxy }) => {
  useEffect(() => {
    proxy.metrics.getUnlocked().map((isUnlocked) => {
      console.log(
        "isUnlocked information coming from iframe client",
        isUnlocked,
      );
    });
  });

  return null;
};
