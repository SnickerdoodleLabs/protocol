import { useAppContext } from "@extension-onboarding/context/App";
import Box from "@material-ui/core/Box";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import React from "react";
import { useCookieVaultContext } from "@extension-onboarding/pages/V2/CookieVault/CookieVault.context";

const VaultStatus = () => {
  const { linkedAccounts } = useAppContext();
  const { discordAccounts } = useCookieVaultContext();

  const wrapper = (text: string, isCompleted) => {
    return (
      <Box
        mt={1}
        pl={2}
        pr={1.5}
        py={1}
        borderRadius={8}
        bgcolor={colors.BLUE600}
        color={colors.WHITE}
        display="flex"
        justifyContent="space-between"
      >
        <SDTypography
          variant="titleSm"
          color="inherit"
          fontWeight="medium"
          {...(isCompleted && {
            style: {
              textDecoration: "line-through",
            },
          })}
        >
          {text}
        </SDTypography>
        <img
          src={`https://storage.googleapis.com/dw-assets/spa/icons-v2/${
            isCompleted ? "" : "un"
          }completed-progress.svg`}
        />
      </Box>
    );
  };

  return (
    <Box p={4} bgcolor={colors.BLUE500} borderRadius={12}>
      <SDTypography variant="titleMd" fontWeight="bold" hexColor={colors.WHITE}>
        Fill Your Vault
      </SDTypography>
      <Box mt={0.5} />
      <SDTypography variant="titleXs" hexColor={colors.BLUE100}>
        Complete snapshots, earn rewards
      </SDTypography>
      <Box mt={3} />
      {wrapper("Connect Your Wallet", linkedAccounts.length > 0)}
      {wrapper("Connect Your Socials", discordAccounts.length > 0)}
      {wrapper("Complete Questionnaires", false)}
    </Box>
  );
};

export default VaultStatus;
