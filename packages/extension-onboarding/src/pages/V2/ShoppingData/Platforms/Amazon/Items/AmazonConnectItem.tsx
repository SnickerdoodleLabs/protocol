import { Box } from "@material-ui/core";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, memo } from "react";

interface IAmazonConnectionItemProps {
  icon: string;
  providerName: string;
  handleConnectClick: () => void;
}

export const AmazonConnectItem: FC<IAmazonConnectionItemProps> = memo(
  ({ icon, providerName, handleConnectClick }: IAmazonConnectionItemProps) => {
    return (
      <>
        <Box display="flex" alignItems="center">
          <Box>
            <img width={47} height={41} src={icon} />
          </Box>
          <Box ml={2}>
            <SDTypography fontWeight="bold" variant="titleLg">
              {providerName}
            </SDTypography>
          </Box>
        </Box>
        <Box>
          <SDButton onClick={handleConnectClick}>Connect</SDButton>
        </Box>
      </>
    );
  },
);
