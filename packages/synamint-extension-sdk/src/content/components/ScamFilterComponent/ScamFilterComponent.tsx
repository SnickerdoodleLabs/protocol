import { Box } from "@material-ui/core";
import SafeUrlNotification from "@synamint-extension-sdk/content/components/ScamFilterComponent/SafeUrlNotification";
import ScamNotification from "@synamint-extension-sdk/content/components/ScamFilterComponent/ScamNotification";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import React, { FC } from "react";

export interface IScamFilterComponentProps {
  scamFilterStatus: EScamFilterStatus;
  coreGateway: ExternalCoreGateway;
}

export enum EScamFilterStatus {
  VERIFIED = "VERIFIED",
  MALICIOUS = "MALICIOUS",
  NOT_VERIFIED = "NOT VERIFIED",
}

const ScamFilterComponent: FC<IScamFilterComponentProps> = ({
  scamFilterStatus,
  coreGateway,
}) => {
  const renderScamFilter = () => {
    switch (scamFilterStatus) {
      case EScamFilterStatus.MALICIOUS: {
        return <ScamNotification />;
      }
      case EScamFilterStatus.VERIFIED: {
        return <SafeUrlNotification coreGateway={coreGateway} />;
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
