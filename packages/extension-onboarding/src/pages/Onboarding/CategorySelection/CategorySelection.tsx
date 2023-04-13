import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import Button from "@extension-onboarding/components/Button";
import TagSelection from "@extension-onboarding/components/TagSelection";
import { useStyles } from "@extension-onboarding/pages/Onboarding/CategorySelection/CategorySelection.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
const CategorySelection: FC = () => {
  const classes = useStyles();
  return (
    <>
      <img src={snickerDoodleLogo} />
      <Box mt={4}>
        <TagSelection />
        <Box
          display="flex"
          flexDirection="column"
          marginLeft="auto"
          alignItems="center"
          width="30%"
          mt={10}
        >
          <Box mb={3}>
            <Typography className={classes.infoText}>
              Last Step On The Way to Your Data Wallet...
            </Typography>
          </Box>
          <Button
            onClick={() => {
              sessionStorage.removeItem("appMode");
              window.location.reload();
            }}
            fullWidth
          >
            Go to Data Wallet
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CategorySelection;
