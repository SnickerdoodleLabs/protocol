import React, { useEffect, useState, FC } from "react";
import { useNavigate } from "react-router";

import placeholder from "@extension-onboarding/assets/images/image-placeholder.png";
import { INFT } from "@extension-onboarding/objects";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";
import { Box, CircularProgress } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { colors } from "@snickerdoodlelabs/shared-components";

interface IMediaRendererProps {
  metadataString: string | null;
}

const MediaRenderer: FC<IMediaRendererProps> = ({ metadataString }) => {
  const [nftData, setNftData] = useState<null | INFT>();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  if (!metadataString || isError) {
    return (
      <img
        width="100%"
        style={{ borderRadius: 4, aspectRatio: "1.2", objectFit: "cover" }}
        src={placeholder}
      />
    );
  }

  return (
    <>
      {nftData && (
        <>
          {isLoading && (
            <Skeleton
              variant="rect"
              width="100%"
              style={{
                aspectRatio: "1.2",
                height: "auto",
                borderRadius: 4,
              }}
            />
          )}
          <img
            width="100%"
            style={{
              borderRadius: 4,
              aspectRatio: "1.2",
              objectFit: "cover",
              display: isLoading ? "none" : "block",
            }}
            src={nftData.imageUrl || placeholder}
            onError={() => setIsError(true)}
            onLoad={() => setIsLoading(false)}
          />
        </>
      )}
    </>
  );
};

export default MediaRenderer;
