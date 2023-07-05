import { Box, Typography, IconButton } from "@material-ui/core";
import { Button } from "@shared-components/components/Button";
import React, { FC } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { useStyles } from "@shared-components/components/SubscriptionSuccess/SubscriptionSuccess.style";

interface ISubscriptionSuccessProps {
  campaignImage: string;
  campaignName: string;
  onCloseClick: () => void;
}

export const SubscriptionSuccess: FC<ISubscriptionSuccessProps> = ({
  campaignImage,
  campaignName,
  onCloseClick,
}) => {
  const classes = useStyles();
  return (
    <>
      <Box
        display="flex"
        mb={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography className={classes.title}>Congrats!</Typography>
        <IconButton
          disableFocusRipple
          disableRipple
          disableTouchRipple
          aria-label="close"
          onClick={onCloseClick}
        >
          <CloseIcon style={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      <>
        <Box flexDirection="column" display="flex">
          <Box display="flex" alignItems="center" justifyContent="center">
            <img
              style={{
                width: 230,
                height: 230,
                objectFit: "cover",
                borderRadius: 8,
              }}
              src={campaignImage}
            />
          </Box>
          <Box mt={3} mb={1}>
            <Typography className={classes.subtitle}>
              {`You Subcribed to ${campaignName} Rewards Program`}
            </Typography>
          </Box>
          <Typography className={classes.content}>
            Your reward will be in your wallet shortly. Thank you for
            subscribing!
          </Typography>
        </Box>
        <Box mt={3} display="flex">
          <Box marginLeft="auto">
            <Button buttonType="primary" onClick={onCloseClick}>
              Ok
            </Button>
          </Box>
        </Box>
      </>
    </>
  );
};
