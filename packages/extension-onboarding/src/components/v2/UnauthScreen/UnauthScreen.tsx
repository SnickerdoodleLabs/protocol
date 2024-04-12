import { EPathsV2 as EPaths } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { useAppContext } from "@extension-onboarding/context/App";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  title: {
    color: "rgba(35, 32, 57, 0.80)",
    fontFamily: "Roboto",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 200,
    lineHeight: "20px",
  },
}));

const UnauthScreen = () => {
  const { pathname } = useLocation();
  const { setLinkerModalOpen } = useAppContext();
  const classes = useStyles();

  const { title, image } = useMemo(() => {
    switch (pathname) {
      case EPaths.TOKENS: {
        return {
          title:
            "To see your tokens, you have to link your crypto account first.",
          image:
            "https://storage.googleapis.com/dw-assets/spa/images/token.png",
        };
      }
      case EPaths.POAP_NFTS: {
        return {
          title:
            "To see your POAPs, you have to link your crypto account first.",
          image: "https://storage.googleapis.com/dw-assets/spa/images/poap.png",
        };
      }
      case EPaths.NFTS: {
        return {
          title:
            "To see your NFTs, you have to link your crypto account first.",
          image: "https://storage.googleapis.com/dw-assets/spa/images/nfts.png",
        };
      }

      default: {
        return {
          title: "You have to link your crypto account first.",
          image:
            "https://storage.googleapis.com/dw-assets/spa/images/token.png",
        };
      }
    }
  }, [pathname]);

  return (
    <Box display="flex">
      <Box
        width={{ xs: "60%", sm: "50%", md: "35%", lg: "30%" }}
        ml="auto"
        mr="auto"
        mt={6}
        display="flex"
        flexDirection="column"
      >
        <img width="100%" src={image} />
        <Box mt={1} />
        <SDTypography variant="bodyLg" align="center">
          {title}
        </SDTypography>
        <Box mt={3} />
        <SDButton onClick={setLinkerModalOpen}>Link Account</SDButton>
      </Box>
    </Box>
  );
};

export default UnauthScreen;
