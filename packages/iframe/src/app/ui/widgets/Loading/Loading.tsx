import {
  Box,
  Spinner,
  useTheme,
  ITheme,
  useMedia,
} from "@core-iframe/app/ui/lib";
import React, { FC, useMemo } from "react";

interface ILoadingProps {}

export const Loading: FC<ILoadingProps> = ({}) => {
  const theme = useTheme<ITheme>();
  const media = useMedia();
  const isMobile = useMemo(() => media === "xs", [media]);

  return (
    <Box
      display="flex"
      bg={theme.palette.background}
      m="auto"
      py={15}
      width={isMobile ? "95%" : "30%"}
      borderRadius={isMobile ? 12 : 0}
      justifyContent="center"
      center
    >
      <Spinner />
    </Box>
  );
};
