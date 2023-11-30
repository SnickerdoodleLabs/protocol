import { Box, Button, Typography } from "@material-ui/core";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
import React from "react";

import Empty from "@extension-onboarding/assets/images/nft.png";
import { DOWNLOAD_URL } from "@extension-onboarding/constants";

const IFrameComponent = () => {
  return (
    <Box mt={8}>
      <Box display="flex" justifyContent="center">
        <img width={334} height={196} src={Empty} />
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Box width={319}>
          <SDTypography variant="bodyLg" align="center">
            For this feature, you will need a SnickerDoodle Data Wallet
            extension.
          </SDTypography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <SDButton
          onClick={() => {
            window.open(DOWNLOAD_URL, "_blank");
          }}
        >
          Get Extension
        </SDButton>
      </Box>
    </Box>
  );
};

export default IFrameComponent;
