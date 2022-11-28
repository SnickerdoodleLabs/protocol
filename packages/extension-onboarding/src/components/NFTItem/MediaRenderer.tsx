import React, { useEffect, useState, FC } from "react";
import MetadaParser, {
  INFT,
} from "@extension-onboarding/components/NFTItem/NftMetadataParser";
import NftMetadataParser from "@extension-onboarding/components/NFTItem/NftMetadataParser";
import placeholder from "@extension-onboarding/assets/images/image-placeholder.png";

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
    NftMetadataParser.getParsedNFT(metadataString!).map((res) => {
      setNftData(res);
    });
  };

  if (!metadataString) {
    return (
      <img
        width={150}
        height={140}
        style={{ borderRadius: "8px 8px 0px 0px", objectFit: "cover" }}
        src={placeholder}
      />
    );
  }

  return (
    <>
      {nftData && (
        <img
          width={150}
          height={140}
          style={{ borderRadius: "8px 8px 0px 0px", objectFit: "cover" }}
          src={nftData.imageUrl || placeholder}
        />
      )}
    </>
  );
};

export default MediaRenderer;
