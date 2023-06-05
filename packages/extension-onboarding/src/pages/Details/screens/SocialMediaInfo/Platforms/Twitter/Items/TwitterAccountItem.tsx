import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Twitter/Twitter.style";
import { Box, Button, Tooltip, Typography } from "@material-ui/core";
import { TwitterFollowData, TwitterProfile } from "@snickerdoodlelabs/objects";
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

    const formatter = new Intl.NumberFormat("en-GB", {
      notation: "compact",
      compactDisplay: "short",
    });

    const getFollowNumber = <Key extends keyof TwitterFollowData>(
      data: TwitterFollowData | undefined,
      key: Key,
    ): number => {
    
      if (!(data && data[key])) {
        return 0;
      }
      return data[key].length;
    };
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
            <Tooltip
              title={
                getFollowNumber(followData, "followers") > 9999
                  ? getFollowNumber(followData, "followers")
                  : ""
              }
              arrow
              classes={{ tooltip: classes.fallowerToolTip }}
            >
              <Typography className={classes.fallowerNumberFont}>
                {formatter.format(getFollowNumber(followData, "following"))}
              </Typography>
            </Tooltip>
            <Typography className={classes.fallowerTextFont}>
              Following
            </Typography>
          </Box>
          <Box className={classes.fallowerContainer}>
            <Tooltip
              title={
                getFollowNumber(followData, "followers") > 9999
                  ? getFollowNumber(followData, "followers")
                  : ""
              }
              arrow
              classes={{ tooltip: classes.fallowerToolTip }}
            >
              <Typography className={classes.fallowerNumberFont}>
                {formatter.format(getFollowNumber(followData, "followers"))}
              </Typography>
            </Tooltip>
            <Typography className={classes.fallowerTextFont}>
              Followers
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  },
);
