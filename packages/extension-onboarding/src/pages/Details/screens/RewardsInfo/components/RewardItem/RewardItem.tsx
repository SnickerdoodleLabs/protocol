import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import { useStyles } from "@extension-onboarding/pages/Details/screens/RewardsInfo/components/RewardItem/RewardItem.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Grid, Icon, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { IOpenSeaMetadata, IpfsCID } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";

declare const window: IWindowWithSdlDataWallet;
interface IRewardItemProps {
  rewardCID: IpfsCID;
  onLeaveClick: () => void;
}
const RewardItem: FC<IRewardItemProps> = ({ rewardCID, onLeaveClick }) => {
  const [rewardItem, setRewardItem] = useState<IOpenSeaMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const classes = useStyles();

  useEffect(() => {
    getRewardItem();
  }, []);

  useEffect(() => {
    if (rewardItem) {
      setIsLoading(false);
    }
  }, [JSON.stringify(rewardItem)]);

  const getRewardItem = () => {
    window.sdlDataWallet
      .getInvitationMetadataByCID(rewardCID)
      .map((metadata) => {
        setRewardItem(metadata);
      })
      .mapErr((e) => {
        setIsLoading(false);
      });
  };

  return (
    <Grid item xs={12} sm={3}>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
        border="1px solid #D9D9D9"
        borderRadius={8}
      >
        <Box mx="auto" p={2} width="calc(100% - 32px)">
          {rewardItem ? (
            <img className={classes.image} src={rewardItem.image} />
          ) : isLoading ? (
            <Box className={classes.imageLoader}>
              <Skeleton variant="rect" width="100%" height="100%" />
            </Box>
          ) : (
            <Box className={classes.imageLoader}>
              <BrokenImageIcon className={classes.brokenImageIcon} />
            </Box>
          )}
        </Box>

        <Box>
          <Typography className={classes.name}>
            {rewardItem ? (
              rewardItem.rewardName
            ) : isLoading ? (
              <Box px={2}>
                <Skeleton />
              </Box>
            ) : (
              " "
            )}
          </Typography>
        </Box>
        <Box mt={1} mb={2}>
          <Typography className={classes.link} onClick={onLeaveClick}>
            Burn Reward
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};
export default RewardItem;
