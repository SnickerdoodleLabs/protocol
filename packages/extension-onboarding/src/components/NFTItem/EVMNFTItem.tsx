import Box from "@material-ui/core/Box";
import { NftMetadataParseUtils } from "@snickerdoodlelabs/common-utils";
import { EVMNFT } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useMemo } from "react";

import { EModalSelectors } from "@extension-onboarding/components/Modals";
import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";

export interface IEVMNFTItemProps {
  item: EVMNFT;
}

export const EVMNFTItem: FC<IEVMNFTItemProps> = ({
  item,
}: IEVMNFTItemProps) => {
  const classes = useStyles();
  const { setModal } = useLayoutContext();

  const nftData = useMemo(() => {
    if (item.metadata) {
      const val = NftMetadataParseUtils.getParsedNFT(
        JSON.stringify(item.metadata),
      );
      return NftMetadataParseUtils.getParsedNFT(JSON.stringify(item.metadata));
    }
    return undefined;
  }, [item]);

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
      <Box display="flex" justifyContent="center">
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
