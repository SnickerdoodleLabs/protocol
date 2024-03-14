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

export const ImageComponent: FC<IImageProps> = ({
  src,
  alt,
  width,
  height,
  style,
  errorImageSrc = "https://storage.googleapis.com/dw-assets/spa/icons-v2/default-survey-icon.svg",
  className,
}) => {
  const [state, setState] = useState({
    isError: false,
    isLoading: true
  });

  const formattedUrl = useMemo(() => {
    return src.replace(
      "ipfs://",
      "https://ipfs-gateway.snickerdoodle.com/ipfs/",
    );
  }, [src]);

  useEffect(() => {
    // Reset loading and error states when src changes
    setState({ isError: false, isLoading: true });

    // Load image
    const imageElement = new Image();
    imageElement.src = formattedUrl;
    imageElement.onload = () => setState({ isError: false, isLoading: false });
    imageElement.onerror = () => setState({ isError: true, isLoading: false });

    return () => {
      // Clean up if component unmounts before image loads
      imageElement.onload = null;
      imageElement.onerror = null;
    };
  }, [src, formattedUrl]);

  if (state.isLoading) {
    return <Skeleton variant="rect" width={width} height={height} />;
  }

  if (state.isError) {
    return (
      <img
        src={errorImageSrc}
        alt={alt}
        width={width}
        height={height}
        style={style}
        className={className}
      />
    );
  }

  return (
    <img
      src={formattedUrl}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={className}
    />
  );
};
