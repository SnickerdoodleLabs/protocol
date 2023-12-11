import { Box } from "@material-ui/core";
import { NftMetadataParseUtilsExtension } from "@snickerdoodlelabs/core";
import { SuiNFT } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useMemo } from "react";

import { EModalSelectors } from "@extension-onboarding/components/Modals";
import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";

export interface ISuiNFTItemProps {
  item: SuiNFT;
}

export const SuiNFTItem: FC<ISuiNFTItemProps> = ({
  item,
}: ISuiNFTItemProps) => {
  const classes = useStyles();

  const { setModal } = useLayoutContext();

  const nftData = useMemo(() => {
    if (item.metadata) {
      return NftMetadataParseUtilsExtension.getParsedNFT(
        JSON.stringify(item.metadata),
      );
    }
    return undefined;
  }, [item]);

  const name = useMemo(() => {
    const _name = nftData?.name ?? item?.name ?? "_";
    return _name ? _name : "_";
  }, [nftData]);

  return (
    <Box
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
        <MediaRenderer nftData={nftData} />
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
