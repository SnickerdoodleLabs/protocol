import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { Box, Container } from "@material-ui/core";
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
                  fontWeight="bold"
                  variant={media === "xs" ? "titleLg" : "headlineSm"}
                >
                  {PageBannerItems[pathname].name}
                </SDTypography>
                <Box mt={{ xs: 0.5, sm: 2 }} />
                <SDTypography variant={media === "xs" ? "bodySm" : "titleSm"}>
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
