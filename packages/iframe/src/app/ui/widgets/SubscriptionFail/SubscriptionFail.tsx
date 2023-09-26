import { CloseButton } from "@core-iframe/app/ui/components/CloseButton";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMedia,
  ITheme,
  defaultDarkTheme,
} from "@core-iframe/app/ui/lib";
import React, { FC, useMemo } from "react";
interface ISubscriptionFailProps {
  onClick: () => void;
}
export const SubscriptionFail: FC<ISubscriptionFailProps> = ({ onClick }) => {
  const theme = useTheme<ITheme>() || defaultDarkTheme;
  const media = useMedia();
  const isMobile = useMemo(() => media === "xs", [media]);
  return (
    <Box
      display="flex"
      bg={theme.palette.background}
      m="auto"
      p={isMobile ? 3 : 4}
      width={isMobile ? "calc(95% - 48px)" : "30%"}
      borderRadius={isMobile ? 12 : 0}
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
      >
        <Typography
          variant="title"
          {...(!isMobile && {
            style: {
              marginLeft: 48,
              textAlign: "center",
              width: "-webkit-fill-available",
            },
          })}
        >
          Subscription Failed!
        </Typography>
        <CloseButton onClick={onClick} />
      </Box>
      <Typography
        {...(!isMobile && {
          textAlign: "center",
        })}
        variant="subtitle"
      >
        Thank you for your interest!
      </Typography>
      <Box mb={1} />

      <Typography
        {...(!isMobile && {
          textAlign: "center",
        })}
        variant="body"
      >
        Looks like this reward was sold out.
      </Typography>

      <Box mt={3} width="100%" m="auto">
        <Button onClick={onClick} fullWidth variant="outlined">
          OK
        </Button>
      </Box>
    </Box>
  );
};
