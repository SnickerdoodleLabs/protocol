import { Box, Grid, Typography } from "@material-ui/core";
import { IEVMNFT } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";

import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";

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
        <Grid item className={classes.card}>
          <Box>
            <img
              width={150}
              height={140}
              style={{ borderRadius: "8px 8px 0px 0px" }}
              src={nftImages[0].replace("ipfs://", "https://ipfs.io/ipfs/")}
            />
            <Box mt={-0.5} bgcolor="rgba(253, 243, 225, 0.6)">
              <Box p={2}>
                <Typography className={classes.nftName}>
                  {item?.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      ) : null}
    </>
  );
};
export default NFTItem;
