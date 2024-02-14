import { useAppContext } from "@extension-onboarding/context/App";
import {
  EInfoCardVisiblity,
  EPageKeys,
} from "@extension-onboarding/objects/interfaces/IUState";
import { Box, Collapse, Grid } from "@material-ui/core";
import {
  CloseButton,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useState } from "react";

const InfoCard: FC = () => {
  const { uiStateUtils } = useAppContext();
  const [isVisible, setIsVisible] = useState<boolean>(
    uiStateUtils.getUIState().infoCards[EPageKeys.COOKIE_VAULT] ===
      EInfoCardVisiblity.VISIBLE,
  );
  const hideInfoCard = () => {
    uiStateUtils.changeInfoCardVisibility(
      EPageKeys.COOKIE_VAULT,
      EInfoCardVisiblity.HIDDEN,
    );
    setIsVisible(false);
  };
  return (
    <>
      <Collapse unmountOnExit in={isVisible}>
        <Box
          py={4}
          px={5}
          mb={3}
          borderRadius={12}
          position="relative"
          bgcolor={colors.MAINPURPLE500}
          color={colors.WHITE}
        >
          <Box position="absolute" top={20} right={20}>
            <CloseButton color={colors.WHITE} onClick={hideInfoCard} />
          </Box>
          <Grid container alignItems="center" spacing={5}>
            <Grid item xs={12} sm={3}>
              <Box
                margin="auto"
                width={{ xs: "50%", sm: "100%" }}
                display="flex"
                justifyContent={{ xs: "center", sm: "flex-end" }}
              >
                <img
                  width="80%"
                  src="https://storage.googleapis.com/dw-assets/spa/icons-v2/cookie-vault-card.svg"
                />
              </Box>
            </Grid>
            <Grid item sm={9} xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                color={colors.WHITE}
              >
                <SDTypography
                  variant="titleXl"
                  fontFamily="shrikhand"
                  color="inherit"
                >
                  Welcome to the Cookie Vault
                </SDTypography>
                <Box mt={2} />
                <SDTypography variant="bodyLg" color="inherit">
                  The Vault helps your privately capture your data and
                  information and gets it ready for rewards
                </SDTypography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </>
  );
};

export default InfoCard;
