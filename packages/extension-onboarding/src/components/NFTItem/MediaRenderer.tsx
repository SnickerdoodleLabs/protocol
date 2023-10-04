import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState, FC } from "react";
import { useNavigate } from "react-router";

import placeholder from "@extension-onboarding/assets/images/image-placeholder.png";
import { INFT } from "@extension-onboarding/objects";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";

interface IMediaRendererProps {
  metadataString: string | null;
}

const MediaRenderer: FC<IMediaRendererProps> = ({ metadataString }) => {
  const [nftData, setNftData] = useState<null | INFT>();
  useEffect(() => {
    getNftData();
  }, []);

  useEffect(() => {}, []);

  const getNftData = () => {
    if (!metadataString) {
      setNftData(null);
    }
    setNftData(NftMetadataParseUtils.getParsedNFT(metadataString!));
  };

  if (!metadataString) {
    return (
      <img
        width={160}
        height={160}
        style={{ borderRadius: 80, objectFit: "cover" }}
        src={placeholder}
      />
    );
  }

  const useStyles = makeStyles((theme) => ({
    image: {
      width: "160px",
      height: "160px",
      borderRadius: "80px",
      objectFit: "cover",
      [theme.breakpoints.down("sm")]: {
        width: "140px",
        height: "140px",
      },
      [theme.breakpoints.down("xs")]: {
        width: "130px",
        height: "130px",
      },
    },
  }));

  const classes = useStyles();

  return (
    <>
      {nftData && (
        <img className={classes.image} src={nftData.imageUrl || placeholder} />
      )}
    </>
  );
};

export default MediaRenderer;
