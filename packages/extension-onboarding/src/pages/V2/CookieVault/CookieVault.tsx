import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import { CookieVaultContextProvider } from "@extension-onboarding/pages/V2/CookieVault/CookieVault.context";
import InfoCard from "@extension-onboarding/pages/V2/CookieVault/Sections/InfoCard/";
import Questionnaires from "@extension-onboarding/pages/V2/CookieVault/Sections/Questionnaires/";
import SocialAccountLinking from "@extension-onboarding/pages/V2/CookieVault/Sections/SocialAccountLinking";
import VaultStatus from "@extension-onboarding/pages/V2/CookieVault/Sections/VaultStatus";
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
          <CookieVaultContextProvider>
            <Grid item xs={12} sm={8}>
              <Questionnaires />
              <WalletLinking />
              <SocialAccountLinking />
            </Grid>
            <Grid item xs={12} sm={4}>
              <VaultStatus />
            </Grid>
          </CookieVaultContextProvider>
        </Grid>
      </Container>
    </>
  );
};

export default CookieVault;
