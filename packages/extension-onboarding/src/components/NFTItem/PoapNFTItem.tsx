import { EModalSelectors } from "@extension-onboarding/components/Modals";
import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { POAPMetadata } from "@extension-onboarding/objects";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";
import { Box, Grid } from "@material-ui/core";
import { EVMNFT } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo, useState } from "react";

export interface IPoapNFTItemProps {
  item: EVMNFT;
}

export const PoapNFTItem: FC<IPoapNFTItemProps> = ({
  item,
}: IPoapNFTItemProps) => {
  const classes = useStyles();
  const [metadata, setMetadata] = useState<POAPMetadata>();

  const { setModal } = useLayoutContext();

  const nftData = useMemo(() => {
    if (item.metadata) {
      return NftMetadataParseUtils.getParsedNFT(JSON.stringify(item.metadata));
    }
    return undefined;
  }, [item]);

  const name = useMemo(() => {
    const _name = nftData?.name ?? item?.name ?? "_";
    return _name ? _name : "_";
  }, [nftData]);
  useEffect(() => {
    getMetadata();
  }, []);

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

  const getMetadata = () => {
    fetch(
      `https://api.poap.tech/metadata/${nftData?.event?.id}/${item.tokenId}/`,
    )
      .then((res) => {
        res.json().then((data) => {
          setMetadata(data as POAPMetadata);
        });
      })
      .catch(() => {});
  };

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
      onClick={() => {
        setModal({
          modalSelector: EModalSelectors.NFT_DETAIL_MODAL,
          onPrimaryButtonClick: () => {},
          customProps: { item, nftData, poapMetadata: metadata },
        });
      }}
    >
      <Box display="flex" justifyContent="center" mb={1.5}>
        <MediaRenderer nftData={nftData} />
      </Box>
      <SDTypography
        variant="bodyLg"
        fontWeight="bold"
        color="textHeading"
        className={classes.name}
      >
        {name}
      </SDTypography>
      <Box mt={1} />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <SDTypography variant="bodyMd" fontWeight="medium">
            Event Date
          </SDTypography>
        </Grid>
        <Grid item xs={6}>
          <SDTypography variant="bodyMd">{`${nftData?.event?.startDate}`}</SDTypography>
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
              : `${nftData?.event?.country}`}
          </SDTypography>
        </Grid>
      </Grid>
    </Box>
  );
};
