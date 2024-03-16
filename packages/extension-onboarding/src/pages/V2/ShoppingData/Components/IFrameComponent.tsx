import { Box } from "@material-ui/core";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
import React from "react";

import { DOWNLOAD_URL } from "@extension-onboarding/constants";
import useIsMobile from "@extension-onboarding/hooks/useIsMobile";

export const IFrameComponent = () => {
  const isMobile = useIsMobile();

  return (
    <Box mt={8}>
      <Box display="flex" justifyContent="center">
        <img
          width={334}
          height={196}
          src={
            "https://storage.googleapis.com/dw-assets/spa/images/iframeshoppingdata.png"
          }
        />
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Box width={319}>
          <SDTypography variant="bodyLg" align="center">
            {isMobile
              ? "This feature is not usable on mobile."
              : "For this feature, you will need a SnickerDoodle Data Wallet extension."}
          </SDTypography>
        </Box>
      </Box>
      {!isMobile && (
        <Box display="flex" justifyContent="center" mt={2}>
          <SDButton
            onClick={() => {
              window.open(DOWNLOAD_URL, "_blank");
            }}
          >
            Get Extension
          </SDButton>
        </Box>
      )}
    </Box>
  );
};
