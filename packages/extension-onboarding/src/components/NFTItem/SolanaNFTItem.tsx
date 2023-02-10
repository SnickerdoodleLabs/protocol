import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, Grid, Typography } from "@material-ui/core";
import { SolanaNFT } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

  useEffect(() => {
    getMetadata();
  }, []);

  const getMetadata = () => {
    if (!item.metadataUri) {
      setMetadata({});
      return;
    }
    return apiGateway.NFTMetadataService.fetchNFTMetadata(
      new URL(item.metadataUri),
    )
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
    <Grid item sm={3}>
      <Box
        border="1px solid #D9D9D9"
        display="flex"
        flexDirection="column"
        borderRadius={12}
        p={1.5}
      >
        {!isLoading && (
          <MediaRenderer
            metadataString={metadata ? JSON.stringify(metadata) : null}
          />
        )}
        <Box my={3}>
          <Typography className={classes.nftName}>
            {item?.name || "_"}
          </Typography>
        </Box>
        <Typography
          className={classes.review}
          onClick={() =>
            navigate(EPaths.NFT_DETAIL, {
              state: {
                item,
                metadataString: metadata ? JSON.stringify(metadata) : null,
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
