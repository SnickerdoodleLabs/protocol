import { Box, Grid, Typography, Tooltip } from "@material-ui/core";
import { EVMNFT, WalletNFT } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";

import placeholder from "@extension-onboarding/assets/images/image-placeholder.png";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";

export interface INFTItemProps {
  item: WalletNFT;
}

const NFTItem: FC<INFTItemProps> = ({ item }: INFTItemProps) => {
  const classes = useStyles();

  let nftImages: string[];
  try {
    nftImages = useMemo((): string[] => {
      const regexpImage = /(\"image.*?\":.*?\"(.*?)\\?\")/;
      const regexpUrl = /(https?|ipfs)/i;

      const metadataStr = JSON.stringify((item as EVMNFT).metadata);
      const splittedData = metadataStr.split(regexpImage);
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
  } catch (e) {
    nftImages = [];
  }

  const getImage = () => {
    if (nftImages.length) {
      let imageUrl = nftImages[0];
      if (imageUrl.includes("ipfs://ipfs/")) {
        imageUrl = imageUrl.replace("ipfs://ipfs/", "https://ipfs.io/ipfs/");
      } else {
        imageUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
      }
      return imageUrl;
    }
    return placeholder;
  };

  return (
    <Grid item className={classes.card}>
      <Box>
        <img
          width={150}
          height={140}
          style={{ borderRadius: "8px 8px 0px 0px", objectFit: "cover" }}
          src={getImage()}
        />
        <Box mt={-0.5} bgcolor="rgba(253, 243, 225, 0.6)">
          <Box p={2}>
            <Typography className={classes.nftName}>
              {(item as EVMNFT)?.name || "_"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};
export default NFTItem;
