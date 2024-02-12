import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import CallMadeIcon from "@material-ui/icons/CallMade";
import { Box, Grid } from "@material-ui/core";
import {
  SDTypography,
  useMedia,
  colors,
  SDButton,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";

const navigatorCards = [
  {
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/cookie-vault-card.svg",
    bgColor: colors.MAINPURPLE500,
    color: colors.WHITE,
    title: "Store your Cookies,\nEarn Rewards",
    description:
      "The Cookie Vault lets you privately store\n your data so you can earn",
    buttonText: "Go to Cookie Vault",
    path: EPathsV2.COOKIE_VAULT,
  },
  {
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/offers-card.svg",
    bgColor: "#EB5D5E",
    color: colors.WHITE,
    title: "Unlock Opportunities\nwith Offers",
    description: "Discover new brands and partners in our\nOffers marketplace ",
    buttonText: "Coming Soon",
    path: "",
  },
  {
    icon: "https://storage.googleapis.com/dw-assets/spa/icons-v2/trusted-brands-card.png",
    bgColor: colors.YELLOW500,
    color: colors.DARKPURPLE500,
    title: "Manage Your\nShared Data",
    description: "Track which data you have shared\n in Trusted Brands",
    buttonText: "Coming Soon",
    path: "",
  },
];
const Home: FC = () => {
  const media = useMedia();
  return (
    <>
      <PageBanners />
      <Container>
        <Box
          mt={{ xs: 4, sm: 10 }}
          mb={{ xs: 6.75, sm: 10 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <SDTypography
            fontFamily="shrikhand"
            align="center"
            variant="displaySm"
          >
            {`Welcome to Snickerdoodle!`}
          </SDTypography>
          <Box mt={2} />
          <SDTypography
            align="center"
            variant={media === "xs" ? "titleXs" : "titleMd"}
          >
            {`Your well on your way to taking ownership of your personal data`}
          </SDTypography>
        </Box>
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
                  direction={media === "xs" ? "row-reverse" : "row"}
                >
                  <Grid item xs={5} sm={12}>
                    <Box width="100%" display="flex" justifyContent="center">
                      <img
                        width={media === "xs" ? "75%" : "55%"}
                        src={card.icon}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={7} sm={12}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems={media === "xs" ? "left" : "center"}
                    >
                      <Box mt={{ xs: 0, sm: 4 }} />
                      <SDTypography
                        align={media === "xs" ? "left" : "center"}
                        fontWeight="bold"
                        color="inherit"
                        variant="headlineSm"
                      >
                        {card.title}
                      </SDTypography>
                      <Box mt={2} />
                      <SDTypography
                        align={media === "xs" ? "left" : "center"}
                        color="inherit"
                        variant="bodyLg"
                      >
                        {card.description}
                      </SDTypography>
                      <Box mt={4} />
                      <SDButton
                        {...(index > 0 && { disabled: true })}
                        variant="outlined"
                        color="inherit"
                        endIcon={<CallMadeIcon />}
                        {...(media === "xs" && { fullWidth: true })}
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
