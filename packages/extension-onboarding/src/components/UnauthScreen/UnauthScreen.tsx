import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, Typography } from "@material-ui/core";
import { Button } from "@snickerdoodlelabs/shared-components";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const UnauthScreen = () => {
  const { pathname } = useLocation();
  const { setLinkerModalOpen } = useAppContext();

  const { title, image } = useMemo(() => {
    console.log(pathname, EPaths);
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
          image: "https://storage.googleapis.com/dw-assets/spa/images/nft.png",
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
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box mt={5} mb={2}>
        <img width={350} height="auto" src={image} />
      </Box>
      <Box mb={2} textAlign="center">
        <Typography>{title}</Typography>
      </Box>

      <Button buttonType="primary" onClick={setLinkerModalOpen}>
        Link Account
      </Button>
    </Box>
  );
};

export default UnauthScreen;
