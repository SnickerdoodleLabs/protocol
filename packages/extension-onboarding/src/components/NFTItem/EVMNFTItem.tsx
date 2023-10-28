import { Box, Grid, Typography } from "@material-ui/core";
import { EVMNFT } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";
import { useNavigate } from "react-router";

import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { SDTypography } from "@snickerdoodlelabs/shared-components";

export interface IEVMNFTItemProps {
  item: EVMNFT;
}

export const EVMNFTItem: FC<IEVMNFTItemProps> = ({
  item,
}: IEVMNFTItemProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={4} lg={3} xl={2}>
      <Box
        border="1px solid #D9D9D9"
        display="flex"
        width="100%"
        flexDirection="column"
        borderRadius={12}
        p={1}
        style={{ cursor: "pointer" }}
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
        <Box display="flex" justifyContent="center">
          <MediaRenderer
            metadataString={
              item.metadata ? JSON.stringify(item.metadata) : null
            }
          />
        </Box>
        <Box my={2}>
          <SDTypography
            variant="bodyLg"
            fontWeight="medium"
            className={classes.name}
          >
            {item?.name || "_"}
          </SDTypography>
        </Box>
      </Box>
    </Grid>
  );
};
