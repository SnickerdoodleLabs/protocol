import { Skeleton } from "@material-ui/lab";
import { INFT } from "@snickerdoodlelabs/objects";
import React, { useState, FC } from "react";

interface IMediaRendererProps {
  nftData?: INFT;
  renderLoading?: boolean;
}

const MediaRenderer: FC<IMediaRendererProps> = ({ nftData, renderLoading }) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (renderLoading) {
    return (
      <Skeleton
        variant="rect"
        width="100%"
        style={{
          aspectRatio: "1.2",
          height: "auto",
          borderRadius: 4,
        }}
      />
    );
  }

  if (!nftData || isError) {
    return (
      <img
        width="100%"
        style={{ borderRadius: 4, aspectRatio: "1.2", objectFit: "cover" }}
        src={
          "https://storage.googleapis.com/dw-assets/spa/images/placeholder.svg"
        }
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
            src={
              nftData.imageUrl ||
              "https://storage.googleapis.com/dw-assets/spa/images/placeholder.svg"
            }
            onError={() => setIsError(true)}
            onLoad={() => setIsLoading(false)}
          />
        </>
      )}
    </>
  );
};

export default MediaRenderer;
