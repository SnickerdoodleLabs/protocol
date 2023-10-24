import { Box, Grid, Typography } from "@material-ui/core";
import { EVMNFT, SuiNFT } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";
import { useNavigate } from "react-router";

import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";

export interface ISuiNFTItemProps {
  item: SuiNFT;
}

export const SuiNFTItem: FC<ISuiNFTItemProps> = ({
  item,
}: ISuiNFTItemProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Grid item sm={3}>
      <Box
        border="1px solid #D9D9D9"
        display="flex"
        flexDirection="column"
        borderRadius={12}
        p={1.5}
      >
        <Box mt={1.5} mb={3}>
          <Typography className={classes.name}>{item?.name || "_"}</Typography>
        </Box>
        <Box display="flex" justifyContent="center" mb={1.5}>
          <MediaRenderer
            metadataString={
              item.metadata ? JSON.stringify(item.metadata) : null
            }
          />
        </Box>
        <Typography
          className={classes.review}
          onClick={() =>
            navigate(EPaths.NFT_DETAIL, {
              state: {
                item,
                metadataString: item.metadata
                  ? JSON.stringify(item.metadata)
                  : null,
              },
            })
          }
        >
          Review
        </Typography>
      </Box>
    </Grid>
  );
};
