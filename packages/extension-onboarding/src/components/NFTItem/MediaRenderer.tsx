import React, { useEffect, useState, FC } from "react";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";
import placeholder from "@extension-onboarding/assets/images/image-placeholder.png";
import { useNavigate } from "react-router";
import { INFT } from "@extension-onboarding/objects";

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

  return (
    <>
      {nftData && (
        <img
          width={160}
          height={160}
          style={{ borderRadius: 80, objectFit: "cover" }}
          src={nftData.imageUrl || placeholder}
        />
      )}
    </>
  );
};

export default MediaRenderer;
