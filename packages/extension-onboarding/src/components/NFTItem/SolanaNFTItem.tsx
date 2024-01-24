import { Box } from "@material-ui/core";
import { NftMetadataParseUtils } from "@snickerdoodlelabs/common-utils";
import { SolanaNFT } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo, useState } from "react";

import { EModalSelectors } from "@extension-onboarding/components/Modals";
import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
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

  const nftData = useMemo(() => {
    if (metadata) {
      return NftMetadataParseUtils.getParsedNFT(JSON.stringify(metadata));
    }
    return undefined;
  }, [metadata]);

  const { setModal } = useLayoutContext();

  const name = useMemo(() => {
    const _name = nftData?.name ?? item?.name ?? "_";
    return _name ? _name : "_";
  }, [nftData]);

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
          customProps: { item, nftData },
        });
      }}
    >
      <Box display="flex" justifyContent="center" mb={1.5}>
        <MediaRenderer renderLoading={isLoading} nftData={nftData} />
      </Box>
      <Box my={2}>
        <SDTypography
          variant="bodyLg"
          fontWeight="medium"
          className={classes.name}
        >
          {name}
        </SDTypography>
      </Box>
    </Box>
  );
};
