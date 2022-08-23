import { useStyles } from "@extension-onboarding/pages/Details/screens/RewardsInfo/components/RewardItem/RewardItem.style";
import { Box, Grid, Typography } from "@material-ui/core";
import { IOpenSeaMetadata } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IRewardItemProps {
  rewardItem: IOpenSeaMetadata;
  onLeaveClick: () => void;
}
const RewardItem: FC<IRewardItemProps> = ({ rewardItem, onLeaveClick }) => {
  const classes = useStyles();

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
        <Box mx="auto" p={2} minHeight="120">
          <img
            width="100%"
            style={{ aspectRatio: "4/3" }}
            src={rewardItem.image}
          />
        </Box>

        <Box>
          <Typography className={classes.name}>
            {rewardItem.rewardName}
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
