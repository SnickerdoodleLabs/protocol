import { Box, Grid, Typography } from "@material-ui/core";
import { SolanaNFT } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";

import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { useAppContext } from "@extension-onboarding/context/App";

import MediaRenderer from "./MediaRenderer";

export interface ISolanaNFTItemProps {
  item: SolanaNFT;
}

export const SolanaNFTItem: FC<ISolanaNFTItemProps> = ({
  item,
}: ISolanaNFTItemProps) => {
  const classes = useStyles();
  const { apiGateway } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<any>();

  useEffect(() => {
    getMetadata();
  }, []);

  const getMetadata = () => {
    if (!item.metadataUri) {
      setMetadata({});
      return;
    }
    return apiGateway.axiosAjaxUtil
      .get<any>(new URL(item.metadataUri), {
        headers: { Accept: "application/json" },
      })
      .map((_metadata) => {
        setMetadata(_metadata);
      })
      .mapErr((e) => {
        setMetadata({});
      });
  };

  useEffect(() => {
    if (metadata) {
      setIsLoading(false);
    }
  }, [JSON.stringify(metadata)]);

  return (
    <Grid item className={classes.card}>
      <Box>
        {!isLoading && (
          <MediaRenderer
            metadataString={metadata ? JSON.stringify(metadata) : null}
          />
        )}

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
