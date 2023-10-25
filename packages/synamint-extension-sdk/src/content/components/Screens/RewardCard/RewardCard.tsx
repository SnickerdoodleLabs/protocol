import { Box, Typography, Dialog, IconButton, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import parse from "html-react-parser";
import React, { useMemo } from "react";

import { useStyles } from "@synamint-extension-sdk/content/components/Screens/RewardCard/RewardCard.style";
import { IOldUserAgreement } from "@snickerdoodlelabs/objects";

interface IRewardCardProps {
  onJoinClick: () => void;
  onCloseClick: () => void;
  onCancelClick: () => void;
  rewardItem: IOldUserAgreement;
  linkedAccountExist: boolean;
}

const RewardCard: React.FC<IRewardCardProps> = ({
  onJoinClick,
  onCloseClick,
  onCancelClick,
  rewardItem,
  linkedAccountExist,
}: IRewardCardProps) => {
  const classes = useStyles();

  const description = useMemo(() => {
    const descriptionText = rewardItem.description;
    if (descriptionText.includes("<")) {
      return (
        <span className={classes.rawHtmlWrapper}>{parse(descriptionText)}</span>
      );
    }
    return (
      <Typography className={classes.description} align="center">
        {descriptionText}
      </Typography>
    );
  }, [JSON.stringify(rewardItem)]);

  return (
    <Dialog
      PaperProps={{
        square: true,
      }}
      open={true}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      disablePortal
    >
      <Box width={480} bgcolor="#FDF3E1">
        <Box bgcolor="#F8D798">
          <Box display="flex" justifyContent="space-between">
            <Box pt={3} pl={4}>
              <img
                width="auto"
                height={20}
                src="https://storage.googleapis.com/dw-assets/extension/sdl-horizontal-logo.svg"
              />
            </Box>
            <Box>
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
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={0.75}
            mb={2}
          >
            <Box>
              <img width="auto" height={145} src={rewardItem.image} />
            </Box>
            <Box
              padding="3px 12px"
              bgcolor="rgba(255, 255, 255, 0.5)"
              borderRadius={4}
              mt={0.75}
              mb={2}
            >
              <Typography align="center" className={classes.rewardName}>
                {rewardItem.rewardName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" flexDirection="column" px={8} pt={4} mb={2}>
            <Typography className={classes.title} align="center">
              {rewardItem.title}
            </Typography>
            {description}
          </Box>
          <Box px={6} mb={3} display="flex" justifyContent="space-between">
            <Button
              variant="text"
              className={classes.secondaryButton}
              onClick={onCancelClick}
            >
              Reject Rewards
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={onJoinClick}
              className={classes.primaryButton}
            >
              {linkedAccountExist ? "Claim Rewards" : "Connect and Claim"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 17 16"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="square"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
                className={classes.primaryButtonIcon}
              >
                <path d="M1.808 14.535 14.535 1.806" className="arrow-body" />
                <path
                  d="M3.379 1.1h11M15.241 12.963v-11"
                  className="arrow-head"
                />
              </svg>
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default RewardCard;
