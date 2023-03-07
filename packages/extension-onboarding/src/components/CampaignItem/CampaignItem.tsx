import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import { useStyles } from "@extension-onboarding/components/CampaignItem/CampaignItem.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { IOpenSeaMetadata, IpfsCID } from "@snickerdoodlelabs/objects";
import React, { ReactNode, FC, useEffect, useState } from "react";

declare const window: IWindowWithSdlDataWallet;
interface ICampaignItemProps {
  campaignCID: IpfsCID;
  onLeaveClick: () => void;
}
const CampaignItem: FC<ICampaignItemProps> = ({
  campaignCID,
  onLeaveClick,
}) => {
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
      .getInvitationMetadataByCID(campaignCID)
      .map((metadata) => {
        setRewardItem(metadata);
      })
      .mapErr((e) => {
        setIsLoading(false);
      });
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="space-between"
      px={2}
      py={1.5}
      mb={2}
    >
      <img src={rewardItem?.image} className={classes.image} />
      <Box my={1.5}>
        <Typography className={classes.name}>
          {rewardItem?.rewardName}
        </Typography>
      </Box>
      <Typography onClick={onLeaveClick} className={classes.leaveButton}>
        Unsubscribe
      </Typography>
    </Box>
  );
};
export default CampaignItem;
