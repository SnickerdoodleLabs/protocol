import placeholder from "@extension-onboarding/assets/images/image-placeholder.png";
import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { POAPMetadata } from "@extension-onboarding/objects";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";
import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { EVMNFT } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export const useStyles = makeStyles((theme) => ({
  name: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: "19px",
    color: "rgba(35, 32, 57, 0.87)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  label: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#424242",
  },
  value: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
    color: "rgba(35, 32, 57, 0.87)",
  },
}));

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
    <Grid item sm={3}>
      <Box
        border="1px solid #D9D9D9"
        display="flex"
        flexDirection="column"
        borderRadius={12}
        p={1.5}
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
        <Box mt={1.5} mb={3}>
          <Typography className={classes.name}>{item?.name || "_"}</Typography>
        </Box>
        <Box display="flex" justifyContent="center" mb={1.5}>
          <img
            width={160}
            height={160}
            style={{ borderRadius: 80, objectFit: "cover" }}
            src={parsedNFTMetaData.imageUrl || placeholder}
          />
        </Box>
        <Box px={0.5}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.label}>Event Date</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                className={classes.value}
              >{`${parsedNFTMetaData.event?.startDate}`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Event Type</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.value}>
                {(isVirtualEvent ?? "") != "" && isVirtualEvent
                  ? "Virtual Event"
                  : "In Person"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Location</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.value}>
                {(isVirtualEvent ?? "") != "" && isVirtualEvent
                  ? "Online"
                  : `${parsedNFTMetaData.event?.country}`}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};
