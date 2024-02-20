import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { Box, Grid } from "@material-ui/core";
import CallMadeIcon from "@material-ui/icons/CallMade";
import {
  SDTypography,
  colors,
  SDButton,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

const navigatorCards = [
  {
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/cookie-vault-card.svg",
    bgColor: colors.MAINPURPLE500,
    color: colors.WHITE,
    title: (
      <span>
        Store your Cookies,
        <br />
        Earn Rewards
      </span>
    ),
    description: (
      <span>
        The Cookie Vault lets you privately store
        <br /> your data so you can earn
      </span>
    ),
    buttonText: "Go to Cookie Vault",
    path: EPathsV2.COOKIE_VAULT,
  },
  {
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/offers-card.svg",
    bgColor: "#EB5D5E",
    color: colors.WHITE,
    title: (
      <span>
        Unlock Opportunities
        <br />
        with Offers
      </span>
    ),
    description: (
      <span>
        Discover new brands and partners in our
        <br />
        Offers marketplace
      </span>
    ),
    buttonText: "Coming Soon",
    path: "",
  },
  {
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/trusted-brands-card.png",
    bgColor: colors.YELLOW500,
    color: colors.DARKPURPLE500,
    title: (
      <span>
        Manage Your
        <br />
        Shared Data
      </span>
    ),
    description: (
      <span>
        Track which data you have shared
        <br /> in Trusted Brands
      </span>
    ),
    buttonText: "Coming Soon",
    path: "",
  },
];
const Home: FC = () => {
  const getResponsiveValue = useResponsiveValue();
  const navigate = useNavigate();
  return (
    <>
      <PageBanners />
      <Container>
        <img
          src="https://storage.googleapis.com/dw-assets/spa/images-v2/home-banner.svg"
          style={{
            width: "calc(100% + 64px)",
            marginLeft: "-32px",
            marginBottom: getResponsiveValue({
              xs: -16,
              sm: -32,
              md: -56,
              lg: -64,
            }),
            marginTop: "28px",
            height: "auto",
          }}
        />
        <Grid container spacing={3}>
          {navigatorCards.map((card, index) => (
            <Grid key={index} item xs={12} sm={4}>
              <Box
                p={4}
                color={card.color}
                bgcolor={card.bgColor}
                borderRadius={16}
              >
                <Grid
                  container
                  direction={getResponsiveValue({
                    xs: "row-reverse",
                    sm: "row",
                  })}
                >
                  <Grid item xs={5} sm={12}>
                    <Box width="100%" display="flex" justifyContent="center">
                      <img
                        width={getResponsiveValue({ xs: "75%", sm: "55%" })}
                        src={card.icon}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={7} sm={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <Box mt={{ xs: 0, sm: 4 }} />
                      <SDTypography
                        align={getResponsiveValue({ xs: "left", sm: "center" })}
                        fontWeight="bold"
                        color="inherit"
                        variant="headlineSm"
                      >
                        {card.title}
                      </SDTypography>
                      <Box mt={2} />
                      <SDTypography
                        align={getResponsiveValue({ xs: "left", sm: "center" })}
                        color="inherit"
                        variant="bodyLg"
                      >
                        {card.description}
                      </SDTypography>
                      <Box mt={4} />
                      <SDButton
                        {...(index > 0 && { disabled: true })}
                        variant="outlined"
                        onClick={() => {
                          navigate(card.path);
                        }}
                        color="inherit"
                        endIcon={<CallMadeIcon />}
                        fullWidth={getResponsiveValue({ xs: true, sm: false })}
                      >
                        {card.buttonText}
                      </SDButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box mt={10} />
      </Container>
    </>
  );
};
export default Home;
