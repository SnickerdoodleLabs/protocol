import placeholder from "@extension-onboarding/assets/images/image-placeholder.png";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { INFT } from "@extension-onboarding/objects";
import { useStyles } from "@extension-onboarding/pages/Details/screens/NFTDetails/NFTDetails.syle";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";
import { Box, Grid, Typography } from "@material-ui/core";
import { EVMNFT, SolanaNFT, WalletNFT } from "@snickerdoodlelabs/objects";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

export default () => {
  const { item, metadataString } = (useLocation().state || {}) as {
    item: EVMNFT | SolanaNFT;
    metadataString: string | null;
  };
  const classes = useStyles();
  const navigate = useNavigate();
  const [parsedNFT, setParsedNFT] = useState<INFT>();
  useEffect(() => {
    if (!item) {
      navigate(EPaths.NFTS, { replace: true });
    } else {
      setNFTData();
    }
  }, []);

  const setNFTData = () => {
    NftMetadataParseUtils.getParsedNFT(metadataString || "").map((nft) => {
      setParsedNFT(nft);
    });
  };

  return (
    <Grid container spacing={4}>
      <Grid item sm={5}>
        <Box border="1px solid #D9D9D9" borderRadius={8} py={2} px={1}>
          <img
            style={{ borderRadius: "8px" }}
            width="100%"
            height="auto"
            src={parsedNFT?.imageUrl ?? placeholder}
          />
        </Box>
        {parsedNFT?.description && (
          <Box mt={3}>
            <Box mb={2}>
              <Typography className={classes.title}>Description</Typography>
            </Box>
            <Typography className={classes.description}>
              {parsedNFT.description}
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid item sm={7}>
        <Box mb={4}>
          <Typography className={classes.name}>
            {item.name || parsedNFT?.name || "-"}
          </Typography>
        </Box>
        <Box mb={2}>
        <Typography className={classes.sectionTitle}>Properties</Typography>
        </Box>
        <Grid container spacing={1}>
          {parsedNFT?.attributes?.map((attribute, index) => (
            <Grid key={index} item xs={4}>
              <Box px={2} py={2} border="1px solid #D9D9D9" borderRadius={12}>
                <Typography>{attribute.trait_type}</Typography>
                <Typography>{attribute.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
