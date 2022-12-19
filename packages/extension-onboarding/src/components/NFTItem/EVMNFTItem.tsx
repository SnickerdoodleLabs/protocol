import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { Box, Grid, Typography } from "@material-ui/core";
import { EVMNFT } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";
import { useNavigate } from "react-router";

import MediaRenderer from "./MediaRenderer";

export interface IEVMNFTItemProps {
  item: EVMNFT;
}

export const EVMNFTItem: FC<IEVMNFTItemProps> = ({
  item,
}: IEVMNFTItemProps) => {
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
        <MediaRenderer
          metadataString={item.metadata ? JSON.stringify(item.metadata) : null}
        />
        <Box my={3}>
          <Typography className={classes.nftName}>
            {item?.name || "_"}
          </Typography>
        </Box>
        <Typography
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
