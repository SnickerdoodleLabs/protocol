import { useAppContext } from "@extension-onboarding/context/App";
import {
  EInfoCardVisiblity,
  EPageKeys,
} from "@extension-onboarding/objects/interfaces/IUState";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import {
  CloseButton,
  SDTypography,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useState } from "react";

const InfoCard: FC = () => {
  const { uiStateUtils } = useAppContext();
  const [isVisible, setIsVisible] = useState<boolean>(
    uiStateUtils.getUIState().infoCards[EPageKeys.COOKIE_VAULT] ===
      EInfoCardVisiblity.VISIBLE,
  );
  const getResponsiveValue = useResponsiveValue();
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
          py={{ xs: 3, sm: 4 }}
          px={{ xs: 3, sm: 5 }}
          mb={3}
          borderRadius={12}
          position="relative"
          bgcolor={colors.MAINPURPLE500}
          color={colors.WHITE}
        >
          <Box
            position="absolute"
            top={{ xs: 10, sm: 20 }}
            right={{ xs: 10, sm: 20 }}
          >
            <CloseButton color={colors.WHITE} onClick={hideInfoCard} />
          </Box>
          <Grid
            container
            alignItems="center"
            spacing={getResponsiveValue({ xs: 2, sm: 5 })}
          >
            <Grid item xs={3}>
              <Box
                margin="auto"
                width="100%"
                display="flex"
                justifyContent={{ xs: "center", sm: "flex-end" }}
              >
                <img
                  width={getResponsiveValue({ xs: "100%", sm: "80%" })}
                  src="https://storage.googleapis.com/dw-assets/spa/icons-v2/cookie-vault-card.svg"
                />
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                color={colors.WHITE}
              >
                <SDTypography
                  variant={getResponsiveValue({
                    xs: "headlineSm",
                    sm: "headlineLg",
                  })}
                  fontFamily="shrikhand"
                  color="inherit"
                >
                  Welcome to the Cookie Vault
                </SDTypography>
                <Box mt={{ xs: 1, sm: 2 }} />
                <SDTypography
                  hexColor={colors.MAINPURPLE100}
                  variant={getResponsiveValue({ xs: "bodyMd", sm: "bodyLg" })}
                  color="inherit"
                >
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
