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
        width="100%"
        style={{ borderRadius: 4, aspectRatio: "1.2", objectFit: "cover" }}
        src={placeholder}
      />
    );
  }

  return (
    <>
      {nftData && (
        <img
          width="100%"
          style={{ borderRadius: 4, aspectRatio: "1.2", objectFit: "cover" }}
          src={nftData.imageUrl || placeholder}
        />
      )}
    </>
  );
};

export default MediaRenderer;
