import { Skeleton } from "@material-ui/lab";
import React, { FC, useState } from "react";

interface IImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  style?: React.CSSProperties;
}

const Image: FC<IImageProps> = ({ src, alt, width, height, style }) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        src={src}
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

export default Image;
