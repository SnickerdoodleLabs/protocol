import pdTour from "@extension-onboarding/assets/images/pd-tour.svg";
import { Button } from "@snickerdoodlelabs/shared-components";
import { useStyles } from "@extension-onboarding/components/Modals/ProductTourStart/ProductTourStart.style";
import { Box, Dialog, Typography } from "@material-ui/core";
import React, { FC } from "react";

interface IProductTourStartProps {
  onNextClick: () => void;
  onCancelClick: () => void;
}

const ProductTourStart: FC<IProductTourStartProps> = ({
  onCancelClick,
  onNextClick,
}: IProductTourStartProps) => {
  const classes = useStyles();
  return (
    <Dialog
      open={true}
      fullWidth
      PaperProps={{
        square: true,
      }}
      disablePortal
      maxWidth="xs"
      className={classes.container}
    >
      <Box>
        <img width="100%" src={pdTour} />
      </Box>
      <Box my={4} mx={2}>
        <Typography className={classes.title}>
          Welcome to Snickerdoodle
        </Typography>
        <Typography className={classes.description}>
          Let's get you set up to monetize your anonymous data!
        </Typography>
        <Box mt={5} display="flex" alignItems="center">
          <Box ml="auto" mr={2}>
            <Button onClick={onCancelClick} buttonType="secondary">
              Close
            </Button>
          </Box>
          <Button onClick={onNextClick}>Let's Start</Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProductTourStart;
