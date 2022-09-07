import React, { FC, useEffect, useMemo } from "react";
import ScamNotification from "./ScamNotification/ScamNotification";
import SafeUrlNotification from "./SafeUrlNotification";
import { Box } from "@material-ui/core";

export interface IScamFilterStatus {
  scamFilterStatus: EScamFilterStatus;
}

export enum EScamFilterStatus {
  VERIFIED = "VERIFIED",
  MALICIOUS = "MALICIOUS",
  NOT_VERIFIED = "NOT VERIFIED",
}

const ScamFilterComponent: FC<IScamFilterStatus> = ({ scamFilterStatus }) => {
  const renderScamFilter = () => {
    switch (scamFilterStatus) {
      case EScamFilterStatus.MALICIOUS: {
        return <ScamNotification />;
      }
      case EScamFilterStatus.VERIFIED: {
        return <SafeUrlNotification />;
      }
      case EScamFilterStatus.NOT_VERIFIED: {
        return null;
      }
      default: {
        return null;
      }
    }
  };

  return <Box>{renderScamFilter}</Box>;
};
export default ScamFilterComponent;
