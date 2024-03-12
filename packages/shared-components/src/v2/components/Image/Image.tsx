import { Skeleton } from "@material-ui/lab";
import { useSafeState } from "@shared-components/v2/hooks";
import React, { FC, useMemo, useState } from "react";

interface IImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  style?: React.CSSProperties;
}

export const Image: FC<IImageProps> = ({ src, alt, width, height, style }) => {
  const [isError, setIsError] = useSafeState<boolean>(false);
  const [isLoading, setIsLoading] = useSafeState<boolean>(true);

  const formattedUrl = useMemo(() => {
    return src.replace(
      "ipfs://",
      "https://ipfs-gateway.snickerdoodle.com/ipfs/",
    );
  }, []);

  if (isError) {
    return (
      <img
        src={
          "https://storage.googleapis.com/dw-assets/spa/icons-v2/default-survey-icon.svg"
        }
        alt={alt}
        width={width}
        height={height}
        style={style}
      />
    );
  }

  return (
    <>
      {isLoading && <Skeleton variant="rect" width={width} height={height} />}
      <img
        src={formattedUrl}
        alt={alt}
        width={width}
        height={height}
        style={{ ...(style ?? {}), display: isLoading ? "none" : "block" }}
        onError={() => {
          setIsError(true);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    </>
  );
};
