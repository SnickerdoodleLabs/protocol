import divider from "@extension-onboarding/assets/images/divider.svg";
import earnSection from "@extension-onboarding/assets/images/earn-section.svg";
import infoSection from "@extension-onboarding/assets/images/info-section.svg";
import sdlLogoSafe from "@extension-onboarding/assets/images/sdl-logo-safe.svg";
import videoSection from "@extension-onboarding/assets/images/video-section.svg";
import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/Modals/ProductTourInitial/ProductTourInitial.style";
import { PRODUCT_VIDEO_URL } from "@extension-onboarding/constants";
import { Box, Grid, Modal } from "@material-ui/core";
import React, { FC } from "react";

interface IProductTourInitialProps {
  onButtonClick: () => void;
}

const ProductTourInitial: FC<IProductTourInitialProps> = ({
  onButtonClick,
}: IProductTourInitialProps) => {
  const classes = useStyles();
  return (
    <Modal
      open
      hideBackdrop
      className={classes.modal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        display="flex"
        flexDirection="column"
        style={{
          overflowY: "scroll",
          width: "100%",
          height: "100%",
          background: "white",
        }}
      >
        <Box
          display="flex"
          px={9}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <img src={sdlLogoSafe} width={190} />
          <Box>
            <Button onClick={onButtonClick} style={{ width: 156 }}>
              Start the Tour
            </Button>
          </Box>
        </Box>
        <Box display="flex" py={4} px={15} bgcolor="rgba(123, 97, 255, 0.1)">
          <Grid container alignItems="center" spacing={5}>
            <Grid item xs={6}>
              <Box display="flex" width="100%">
                <img width="100%" src={videoSection} />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box width="100%" display="flex">
                <video className={classes.video} controls>
                  <source src={PRODUCT_VIDEO_URL} />
                </video>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" width="100%">
          <img src={infoSection} width="100%" />
        </Box>
        <Box display="flex" width="100%">
          <img src={earnSection} width="100%" />
        </Box>
        <Box display="flex" width="100%">
          <img src={divider} width="100%" />
        </Box>
        <Box
          display="flex"
          px={9}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <img src={sdlLogoSafe} width={190} />
          <Box>
            <Button onClick={onButtonClick} style={{ width: 156 }}>
              Start the Tour
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductTourInitial;
