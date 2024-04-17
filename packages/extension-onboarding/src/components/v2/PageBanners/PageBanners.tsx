import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import {
  SDTypography,
  colors,
  useMedia,
} from "@snickerdoodlelabs/shared-components";
import React from "react";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({}));

const PageBannerItems: Partial<
  Record<EPathsV2, { name: string; icon: string; description: string }>
> = {
  [EPathsV2.HOME]: {
    name: "Home",
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/home.svg",
    description: "Your dashboard to your world of data",
  },
  [EPathsV2.COOKIE_VAULT]: {
    name: "Cookie Vault",
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/cookie-vault.svg",
    description: "Privately store your personal info on your device",
  },
  [EPathsV2.TRUSTED_BRANDS]: {
    name: "Trusted Brands",
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/trusted-brands-page.png",
    description: "Here are the brands you’ve shared your data with",
  },
  [EPathsV2.OFFERS]: {
    name: "Offers",
    description:
      "Earn rewards sharing your data and insights with communities and brands you love",
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/offers-page.png",
  },
};

const PageBanners = () => {
  const { pathname } = useLocation();
  const media = useMedia();
  return (
    <>
      {PageBannerItems[pathname] ? (
        <Box
          display="flex"
          width="100%"
          bgcolor={colors.WHITE}
          boxShadow="0px 16px 16px 0px rgba(16, 24, 40, 0.03), 0px 4px 6px 0px rgba(0, 0, 0, 0.03);"
        >
          <Container maxWidth="lg">
            <Box
              display="flex"
              alignItems="center"
              pt={{ xs: 4.5, sm: 3 }}
              pb={{ xs: 2, sm: 3 }}
              gridGap={{ xs: 16, sm: 24 }}
            >
              <img
                width={media === "xs" ? 52 : 72}
                height={media === "xs" ? 52 : 72}
                src={PageBannerItems[pathname].icon}
                alt="back"
              />
              <Box>
                <SDTypography
                  hexColor={colors.DARKPURPLE500}
                  fontWeight="bold"
                  variant={media === "xs" ? "titleLg" : "headlineSm"}
                >
                  {PageBannerItems[pathname].name}
                </SDTypography>
                <Box mt={{ xs: 0.5, sm: 2 }} />
                <SDTypography
                  hexColor={colors.GREY500}
                  variant={media === "xs" ? "bodySm" : "titleSm"}
                >
                  {PageBannerItems[pathname].description}
                </SDTypography>
              </Box>
            </Box>
          </Container>
        </Box>
      ) : null}
    </>
  );
};

export default PageBanners;
