import React, { FC, useMemo } from "react";
import { IOpenSeaMetadata } from "@snickerdoodlelabs/objects";
import { CloseButton } from "@core-iframe/app/ui/components/CloseButton";
import { PROD_DATA_WALLET_URL } from "@core-iframe/app/ui/constants";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMedia,
  ITheme,
  defaultDarkTheme,
} from "@core-iframe/app/ui/lib";

interface ISubscriptionSuccessProps {
  invitationData: IOpenSeaMetadata;
  onClick: () => void;
}
export const SubscriptionSuccess: FC<ISubscriptionSuccessProps> = ({
  invitationData,
  onClick,
}) => {
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
          Congrats!
        </Typography>
        <CloseButton onClick={onClick} />
      </Box>
      <Box
        width="-webkit-fill-available"
        display="flex"
        justifyContent="center"
        my={5.5}
      >
        <img
          style={{
            width: isMobile ? "50%" : "40%",
            height: "auto",
            aspectRatio: 1,
            objectFit: "cover",
          }}
          src={invitationData.nftClaimedImage}
        />
      </Box>
      <Typography
        {...(!isMobile && {
          textAlign: "center",
        })}
        variant="subtitle"
      >
        You have successfully subscribed!
      </Typography>
      <Box mb={1} />

      <Typography
        {...(!isMobile && {
          textAlign: "center",
        })}
        variant="body"
      >
        Snickerdoodle will be delivering your reward.
      </Typography>

      <Box mt={3} width="100%" m="auto">
        <Button onClick={onClick} fullWidth variant="contained">
          OK
        </Button>
      </Box>
      <Box
        mt={3}
        pointer
        onClick={() => {
          window.open(PROD_DATA_WALLET_URL, "_blank");
        }}
        center
        display="flex"
      >
        <Typography variant="link">Explore Data Wallet</Typography>
        <Box ml={0.5}>
          <svg
            width="13"
            height="12"
            viewBox="0 0 13 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 11L11.5 1M11.5 1V10.1176M11.5 1H2.67647"
              stroke={theme.palette.linkText}
              stroke-width="1.6"
            />
          </svg>
        </Box>
      </Box>
    </Box>
  );
};
