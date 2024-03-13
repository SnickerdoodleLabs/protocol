import { Skeleton } from "@material-ui/lab";
import { useSafeState } from "@shared-components/v2/hooks";
import React, { FC, useEffect, useMemo, useState } from "react";

interface IImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  style?: React.CSSProperties;
  errorImageSrc?: string;
  className?: string;
}

export const Image: FC<IImageProps> = ({
  src,
  alt,
  width,
  height,
  style,
  errorImageSrc = "https://storage.googleapis.com/dw-assets/spa/icons-v2/default-survey-icon.svg",
  className,
}) => {
  const [isError, setIsError] = useSafeState<boolean>(false);
  const [isLoading, setIsLoading] = useSafeState<boolean>(true);

  useEffect(() => {
    // Reset loading and error states when src changes
    setIsError(false);
    setIsLoading(true);
  }, [src, setIsError, setIsLoading]);

  const formattedUrl = useMemo(() => {
    return src.replace(
      "ipfs://",
      "https://ipfs-gateway.snickerdoodle.com/ipfs/",
    );
  }, [src]);

  if (isError) {
    return (
      <img
        src={errorImageSrc}
        alt={alt}
        width={width}
        height={height}
        style={style}
        {...(className && { className })}
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
