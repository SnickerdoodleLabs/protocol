import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import { useAppContext } from "@extension-onboarding/context/App";
import BrandItem from "@extension-onboarding/pages/V2/TrustedBrands/BrandItem";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import {
  SDTypography,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { useMemo } from "react";

const TrustedBrands = () => {
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
          <SDTypography
            fontWeight="bold"
            variant={getResponsiveValue({ xs: "titleLg", sm: "headlineMd" })}
            hexColor={colors.DARKPURPLE500}
          >
            My Brands
          </SDTypography>
          <SDTypography
            mt={1.5}
            mb={{ xs: 3, sm: 7 }}
            variant={getResponsiveValue({ xs: "bodyMd", sm: "bodyLg" })}
            fontWeight="regular"
            hexColor={colors.GREY600}
          >
            Here are the brands that you’ve shared your data with
          </SDTypography>

          <Box
            display="flex"
            borderRadius={12}
            border="1px solid"
            borderColor="borderColor"
            flexDirection="column"
            bgcolor={colors.WHITE}
            overflow="hidden"
          >
            <Box
              display="flex"
              py={1}
              px={3}
              alignItems="center"
              justifyContent="space-between"
            >
              <SDTypography
                variant="bodySm"
                fontWeight="bold"
                color="textHeading"
              >
                Brand
              </SDTypography>
              <SDTypography
                variant="bodySm"
                fontWeight="bold"
                color="textHeading"
              >
                Shared
              </SDTypography>
            </Box>
            {Array.from(optedInContracts.entries()).map(
              ([contractAddress, ipfsCID]) => (
                <Box key={contractAddress}>
                  <Divider />
                  <BrandItem
                    contractAddress={contractAddress}
                    ipfsCID={ipfsCID}
                  />
                </Box>
              ),
            )}
          </Box>
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
            src="https://storage.googleapis.com/dw-assets/spa/icons-v2/key.svg"
          />

          <SDTypography
            hexColor={colors.GREY600}
            mt={2}
            variant="bodyLg"
            align="center"
          >
            You’re not currently connected to any brands.
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

export default TrustedBrands;
