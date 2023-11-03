import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { POAPMetadata } from "@extension-onboarding/objects";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";
import { Box, Grid } from "@material-ui/core";
import { EVMNFT } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export interface IPoapNFTItemProps {
  item: EVMNFT;
}

export const PoapNFTItem: FC<IPoapNFTItemProps> = ({
  item,
}: IPoapNFTItemProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState<POAPMetadata>();
  const parsedNFTMetaData = useMemo(
    () => NftMetadataParseUtils.getParsedNFT(JSON.stringify(item.metadata)),
    [item],
  );
  useEffect(() => {
    getMetadata();
  }, []);

  const getMetadata = () => {
    fetch(
      `https://api.poap.tech/metadata/${parsedNFTMetaData.event?.id}/${item.tokenId}/`,
    )
      .then((res) => {
        res.json().then((data) => {
          setMetadata(data as POAPMetadata);
        });
      })
      .catch(() => {});
  };
  const isVirtualEvent = useMemo(() => {
    if (metadata) {
      const virtualEventInfo = metadata.attributes.find(
        (attribute) => attribute.trait_type === "virtualEvent",
      );
      if (virtualEventInfo) {
        return virtualEventInfo.value == "true";
      }
    }
    return undefined;
  }, [metadata]);

  return (
    <Box
      border="1px solid"
      borderColor="borderColor"
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
            poapMetadata: metadata,
            metadataString: item.metadata
              ? JSON.stringify(item.metadata)
              : null,
          },
        })
      }
    >
      <Box display="flex" justifyContent="center" mb={1.5}>
        <MediaRenderer
          metadataString={item.metadata ? JSON.stringify(item.metadata) : null}
        />
      </Box>
      <SDTypography
        variant="bodyLg"
        fontWeight="bold"
        color="textHeading"
        className={classes.name}
      >
        {item?.name || "_"}
      </SDTypography>
      <Box mt={1} />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <SDTypography variant="bodyMd" fontWeight="medium">
            Event Date
          </SDTypography>
        </Grid>
        <Grid item xs={6}>
          <SDTypography variant="bodyMd">{`${parsedNFTMetaData.event?.startDate}`}</SDTypography>
        </Grid>
        <Grid item xs={6}>
          <SDTypography variant="bodyMd" fontWeight="medium">
            Event Type
          </SDTypography>
        </Grid>
        <Grid item xs={6}>
          <SDTypography variant="bodyMd">
            {(isVirtualEvent ?? "") != "" && isVirtualEvent
              ? "Virtual Event"
              : "In Person"}
          </SDTypography>
        </Grid>
        <Grid item xs={6}>
          <SDTypography variant="bodyMd" fontWeight="medium">
            Location
          </SDTypography>
        </Grid>
        <Grid item xs={6}>
          <SDTypography variant="bodyMd">
            {(isVirtualEvent ?? "") != "" && isVirtualEvent
              ? "Online"
              : `${parsedNFTMetaData.event?.country}`}
          </SDTypography>
        </Grid>
      </Grid>
    </Box>
  );
};
