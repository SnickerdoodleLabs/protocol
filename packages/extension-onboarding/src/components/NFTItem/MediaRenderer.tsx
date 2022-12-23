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
    NftMetadataParseUtils.getParsedNFT(metadataString!).map((res) => {
      setNftData(res);
    });
  };

  if (!metadataString) {
    return (
      <img
        width="100%"
        height={140}
        style={{ borderRadius: "8px", objectFit: "cover" }}
        src={placeholder}
      />
    );
  }

  return (
    <>
      {nftData && (
        <img
          width="100%"
          height={140}
          style={{ borderRadius: "8px", objectFit: "cover" }}
          src={nftData.imageUrl || placeholder}
        />
      )}
    </>
  );
};

export default MediaRenderer;
