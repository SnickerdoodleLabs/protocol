import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import InfoCard from "@extension-onboarding/pages/V2/CookieVault/Sections/InfoCard/";
import Questionnaries from "@extension-onboarding/pages/V2/CookieVault/Sections/Questionnaries/";
import SocialAccountLinking from "@extension-onboarding/pages/V2/CookieVault/Sections/SocialAccountLinking";
import WalletLinking from "@extension-onboarding/pages/V2/CookieVault/Sections/WalletLinking";
import { Box, Grid } from "@material-ui/core";
import React, { FC } from "react";
const CookieVault: FC = () => {
  return (
    <>
      <PageBanners />
      <Container>
        <Box mt={7} />
        <InfoCard />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12}>
            <Questionnaries />
            <WalletLinking />
            <SocialAccountLinking />
          </Grid>
          <Grid item xs={12} sm={12}></Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CookieVault;
