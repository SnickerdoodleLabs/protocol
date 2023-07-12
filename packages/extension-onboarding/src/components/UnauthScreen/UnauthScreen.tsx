import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@snickerdoodlelabs/shared-components";
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
        <Typography className={classes.title}>{title}</Typography>
      </Box>

      <Button buttonType="primary" onClick={setLinkerModalOpen}>
        Link Account
      </Button>
    </Box>
  );
};

export default UnauthScreen;
