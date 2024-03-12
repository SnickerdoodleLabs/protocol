import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import {
  SDTypography,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { useMemo } from "react";

const Offers = () => {
  const { optedInContracts } = useAppContext();
  const getResponsiveValue = useResponsiveValue();

  const pageComponent = useMemo(() => {
    if (!optedInContracts) {
      // initial fetch is not completed
      // return loading
      return null;
    }

    if (optedInContracts.size > 0) {
      return (
        <>
          {Array.from(optedInContracts.entries()).map(
            ([contractAddress, ipfsCID]) => (
              <Box key={contractAddress}></Box>
            ),
          )}
        </>
      );
    } else {
      return (
        <Box
          width="100%"
          display="flex"
          mt={8.5}
          flexDirection="column"
          alignItems="center"
        >
          <img
            width={34}
            height={34}
            src="https://storage.googleapis.com/dw-assets/spa/icons-v2/offers-icon.svg"
          />

          <SDTypography
            hexColor={colors.GREY600}
            mt={2}
            variant="bodyLg"
            align="center"
          >
            You currently have no offers
          </SDTypography>
        </Box>
      );
    }
  }, [optedInContracts, getResponsiveValue]);

  return (
    <>
      <PageBanners />
      <Container>
        <Box mt={{ xs: 3, sm: 7 }} />
        {pageComponent}
      </Container>
    </>
  );
};

export default Offers;
