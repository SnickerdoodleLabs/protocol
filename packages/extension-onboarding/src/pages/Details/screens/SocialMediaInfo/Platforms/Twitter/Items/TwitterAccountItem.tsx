import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Twitter/Twitter.style";
import { Box, Button, Typography } from "@material-ui/core";
import { TwitterProfile } from "@snickerdoodlelabs/objects";
import React, { FC, memo } from "react";

interface ITwitterAccountItemProps {
  item: TwitterProfile;
  handleUnlinkClick: () => void;
}

export const TwitterAccountItem: FC<ITwitterAccountItemProps> = memo(
  ({
    item: { userObject, followData },
    handleUnlinkClick,
  }: ITwitterAccountItemProps) => {
    const classes = useStyles();

    return (
      <Box mt={3} borderRadius={12} border="1px solid #D7D5D5" p={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box mt={2.5}>
            <Typography className={classes.guildsName}>
              {userObject.name}
            </Typography>
            <Typography className={classes.guildsTitle}>
              @{userObject.username}
            </Typography>
          </Box>
          <Box>
            <Button
              onClick={handleUnlinkClick}
              className={classes.unlinkAccountButton}
            >
              Unlink Account
            </Button>
          </Box>
        </Box>

        <Box mt={2} mb={3} className={classes.divider} />

        <Box px={2.5} className={classes.fallowerMainContainer}>
          <Box className={classes.fallowerContainer}>
            <Typography className={classes.fallowerNumberFont}>
              {followData?.following ? followData.following.length : 0}
            </Typography>
            <Typography className={classes.fallowerTextFont}>
              Following
            </Typography>
          </Box>
          <Box className={classes.fallowerContainer}>
            <Typography className={classes.fallowerNumberFont}>
              {followData?.followers ? followData.followers.length : 0}
            </Typography>
            <Typography className={classes.fallowerTextFont}>
              Followers
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  },
);
