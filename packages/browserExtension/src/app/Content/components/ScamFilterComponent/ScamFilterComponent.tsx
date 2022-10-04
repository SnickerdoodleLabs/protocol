import React, { FC } from "react";
import ScamNotification from "@app/Content/components/ScamFilterComponent/ScamNotification";
import SafeUrlNotification from "@app/Content/components/ScamFilterComponent/SafeUrlNotification";
import { Box } from "@material-ui/core";

export interface IScamFilterStatus {
  scamFilterStatus: EScamFilterStatus;
}

export enum EScamFilterStatus {
  VERIFIED = "VERIFIED",
  MALICIOUS = "MALICIOUS",
  NOT_VERIFIED = "NOT VERIFIED",
}
export interface IScamFilterPreferences {
  isScamFilterActive: boolean;
  showMessageEveryTime: boolean;
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
