import Container from "@extension-onboarding/components/v2/Container";
import PageBanners from "@extension-onboarding/components/v2/PageBanners";
import { CookieVaultContextProvider } from "@extension-onboarding/pages/V2/CookieVault/CookieVault.context";
import InfoCard from "@extension-onboarding/pages/V2/CookieVault/Sections/InfoCard/";
import Questionnaires from "@extension-onboarding/pages/V2/CookieVault/Sections/Questionnaires/";
import SocialAccountLinking from "@extension-onboarding/pages/V2/CookieVault/Sections/SocialAccountLinking";
import VaultStatus from "@extension-onboarding/pages/V2/CookieVault/Sections/VaultStatus";
import WalletLinking from "@extension-onboarding/pages/V2/CookieVault/Sections/WalletLinking";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import React, { FC } from "react";
const CookieVault: FC = () => {
  return (
    <>
      <PageBanners />
      <Container>
        <Box mt={{ xs: 3, sm: 7 }} />
        <Grid container spacing={4}>
          <CookieVaultContextProvider>
            <Grid item xs={12} sm={12}>
              <WalletLinking />
              <SocialAccountLinking />
              <Questionnaires />
            </Grid>
            {/* <Grid item xs={12} sm={4}>
              <VaultStatus />
            </Grid> */}
          </CookieVaultContextProvider>
        </Grid>
      </Container>
    </>
  );
};

export default CookieVault;
