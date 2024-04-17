import { EPathsV2 as EPaths } from "@extension-onboarding/containers/Router/Router.pathsV2";
import Box from "@material-ui/core/Box";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const EmptyItem = () => {
  const { pathname } = useLocation();

  const { title, image } = useMemo(() => {
    switch (pathname) {
      case EPaths.AIRDROPS: {
        return {
          title: "You don’t have any Airdrops yet.",
          image: "https://storage.googleapis.com/dw-assets/spa/images/nfts.png",
        };
      }
      case EPaths.TOKENS: {
        return {
          title: "You don’t have any Tokens yet.",
          image:
            "https://storage.googleapis.com/dw-assets/spa/images/token.png",
        };
      }
      case EPaths.POAP_NFTS: {
        return {
          title: "You don’t have any POAPs yet.",
          image: "https://storage.googleapis.com/dw-assets/spa/images/poap.png",
        };
      }
      case EPaths.NFTS: {
        return {
          title: "You don’t have any NFTs yet.",
          image: "https://storage.googleapis.com/dw-assets/spa/images/nfts.png",
        };
      }
      case EPaths.TRANSACTION_HISTORY: {
        return {
          title:
            "To see your transactions, you have to link your crypto account first.",
          image:
            "https://storage.googleapis.com/dw-assets/spa/images/transaction.png",
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
      </Box>
    </Box>
  );
};

export default EmptyItem;
