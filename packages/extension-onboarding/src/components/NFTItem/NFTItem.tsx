import { IEVMNFT } from "@snickerdoodlelabs/objects";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import placeholder from "@extension-onboarding/assets/images/image-placeholder.png";
import { Box, Grid, Typography, Tooltip } from "@material-ui/core";
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
              {item?.name || "_"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};
export default NFTItem;
