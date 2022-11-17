import { Box, Grid, Typography } from "@material-ui/core";
import { EVMNFT } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import MediaRenderer from "./MediaRenderer";

export interface IEVMNFTItemProps {
  item: EVMNFT;
}

export const EVMNFTItem: FC<IEVMNFTItemProps> = ({
  item,
}: IEVMNFTItemProps) => {
  const classes = useStyles();

  return (
    <Grid item className={classes.card}>
      <Box>
        <MediaRenderer metadataString={item.metadata ? item.metadata : null} />
        <Box mt={-0.5} bgcolor="rgba(253, 243, 225, 0.6)">
          <Box p={2}>
            <Typography className={classes.nftName}>
              {item?.name || "_"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};
