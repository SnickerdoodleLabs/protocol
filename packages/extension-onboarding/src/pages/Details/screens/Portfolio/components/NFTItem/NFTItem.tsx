import { Box, Grid, Typography } from "@material-ui/core";
import {
  ChainId,
  EVMAccountAddress,
  IEVMNFT,
} from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";
import { useStyles } from "@extension-onboarding/pages/Details/screens/Portfolio/components/NFTItem/NFTItem.style";

export interface INFTItem {
  nftList: IEVMNFT[];
  chainId?: ChainId | undefined;
  selectedAccount?: EVMAccountAddress | undefined;
}
function getMetaDataImage(item: IEVMNFT) {
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
  const nftImage = extractedImages[0].replace(
    "ipfs://",
    "https://ipfs.io/ipfs/",
  );
  return nftImage;
}

const NFTItem: FC<INFTItem> = ({ nftList }) => {
  const classes = useStyles();
  return (
    <Grid container>
      {nftList.length > 0
        ? nftList.map((item) => {
            <Grid item xs={4} className={classes.card}>
              <Box>
                <img
                  width={165}
                  height={165}
                  style={{ borderRadius: "8px 8px 0px 0px" }}
                  src={getMetaDataImage(item)}
                />
                <Box height={68} mt={-0.5} bgcolor="rgba(253, 243, 225, 0.6)">
                  <Box p={2}>
                    <Typography className={classes.nftName}>
                      {item?.name}
                    </Typography>
                    <Typography className={classes.nftTokenId}>
                      Token ID: {item?.tokenId}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>;
          })
        : ""}
    </Grid>
  );
};
export default NFTItem;
