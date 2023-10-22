import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { Box, Grid } from "@material-ui/core";
import { SDTypography, SDButton } from "@snickerdoodlelabs/shared-components";
import React from "react";

const Wallets = () => {
  const { detectedProviders, unDetectedProviders, onProviderConnectClick } =
    useAccountLinkingContext();
  return (
    <Card>
      <CardTitle
        title="Supported Web3 Wallets"
        subtitle="Add a new web3 account to your data profile."
      />
      <Box mt={3} />
      <Grid container spacing={2}>
        {detectedProviders.map((provider, index) => (
          <Grid key={`d.${index}`} xs={12} sm={6} md={4} lg={3} item>
            <Box
              px={3}
              display="flex"
              flexDirection={{ xs: "row", sm: "column" }}
              py={1.5}
              borderRadius={12}
              border="1px solid"
              borderColor={"borderColor"}
            >
              <Box display="flex" alignItems="center" mb={{ xs: 0, sm: 1.5 }}>
                <img src={provider.icon} width={40} height={40} />
                <Box ml={2} />
                <SDTypography
                  variant="bodyLg"
                  fontWeight="medium"
                  color="textHeading"
                >
                  {provider.name}
                </SDTypography>
              </Box>
              <Box ml={{ xs: "auto", sm: 0 }}>
                <SDButton
                  onClick={() => {
                    onProviderConnectClick(provider);
                  }}
                  variant="outlined"
                >
                  Link Account
                </SDButton>
              </Box>
            </Box>
          </Grid>
        ))}
        {unDetectedProviders.map((provider, index) => (
          <Grid key={`d.${index}`} xs={12} sm={6} md={4} lg={3} item>
            <Box
              px={3}
              display="flex"
              flexDirection={{ xs: "row", sm: "column" }}
              py={1.5}
              borderRadius={12}
              border="1px solid"
              borderColor={"borderColor"}
            >
              <Box display="flex" alignItems="center" mb={{ xs: 0, sm: 1.5 }}>
                <img src={provider.icon} width={40} height={40} />
                <Box ml={2} />
                <SDTypography
                  variant="bodyLg"
                  fontWeight="medium"
                  color="textHeading"
                >
                  {provider.name}
                </SDTypography>
              </Box>
              <Box ml={{ xs: "auto", sm: 0 }}>
                <SDButton
                  onClick={() => {
                    window.open(provider.installationUrl, "_blank");
                  }}
                  variant="outlined"
                >
                  Install
                </SDButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default Wallets;
