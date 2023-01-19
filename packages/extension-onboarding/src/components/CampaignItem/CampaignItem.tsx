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
  button: ReactNode;
}
const CampaignItem: FC<ICampaignItemProps> = ({ campaignCID, button }) => {
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
      justifyContent="space-between"
      border="1px solid #D9D9D9"
      borderRadius={8}
      px={4}
      py={2}
      mb={2}
    >
      <Typography
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "20px",
          color: "rgba(35, 32, 57, 0.87)",
        }}
      >
        {rewardItem?.rewardName}
      </Typography>
      <Box>{button}</Box>
    </Box>
  );
};
export default CampaignItem;
