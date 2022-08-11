import { IEVMNFT } from "@snickerdoodlelabs/objects";
import { useStyles } from "@extension-onboarding/components/BalanceItem/BalanceItem.style";
import { Box } from "@material-ui/core";
import React, { FC, useMemo } from "react";

export interface INFTItemProps {
  item: IEVMNFT;
}

const NFTItem: FC<INFTItemProps> = ({ item }: INFTItemProps) => {
  const classes = useStyles();

  const nftImages = useMemo((): string[] => {
    const regexpImage = /(\"image.*?\":.*?\"(.*?)\\?\")/;
    const regexpUrl = /(https?|ipfs)/i;
    const splittedData = item.metadata?.split(regexpImage);
    const extractedImages: string[] = [];
    splittedData?.forEach((key) => {
      if (regexpImage.test(key)) {
        const imageUrl = key.match(regexpImage)?.[2];
        if (imageUrl && regexpUrl.test(imageUrl)) {
          extractedImages.push(imageUrl);
        }
      }
    });
    return extractedImages;
  }, [JSON.stringify(item)]);

  return (
    <>
      {nftImages?.length ? (
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Box>
            <img
              width={175}
              height={175}
              src={nftImages[0].replace("ipfs://", "https://ipfs.io/ipfs/")}
            />
          </Box>
        </Box>
      ) : null}
    </>
  );
};
export default NFTItem;
