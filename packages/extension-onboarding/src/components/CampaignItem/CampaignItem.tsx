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
    <Grid item xs={12} sm={3}>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
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
          <Box mt={1.5}>
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
          </Box>
          <Typography
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "24px",
              color: "#9E9E9E",
            }}
          >
            Limited collection
          </Typography>
          <Box display="flex" mt={1}>
            <Box>{button}</Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};
export default CampaignItem;
