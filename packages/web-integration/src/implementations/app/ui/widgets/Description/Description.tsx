import { PageInvitation } from "@snickerdoodlelabs/objects";
import { AcnowledgmentBanner } from "@web-integration/implementations/app/ui/components/AcknowledgmentBanner/index.js";
import { CloseButton } from "@web-integration/implementations/app/ui/components/CloseButton/index.js";
import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  ITheme,
  useMedia,
} from "@web-integration/implementations/app/ui/lib/index.js";
import React, { FC, useMemo } from "react";

interface IDescriptionProps {
  pageInvitation: PageInvitation;
  onCancelClick: () => void;
  onContinueClick: () => void;
  onSetPermissions: () => void;
}

export const Description: FC<IDescriptionProps> = ({
  pageInvitation,
  onCancelClick,
  onSetPermissions,
  onContinueClick,
}) => {
  const theme = useTheme<ITheme>();
  const media = useMedia();
  const isMobile = useMemo(() => media === "xs", [media]);

  return (
    <Box
      display="flex"
      bg={theme.palette.background}
      m="auto"
      p={isMobile ? 3 : 4}
      pt={isMobile ? 3 : 8}
      width={isMobile ? "calc(95% - 48px)" : "40%"}
      borderRadius={isMobile ? 12 : 0}
      justifyContent="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="title">
            Why are we giving you a choice for data sharing?!
          </Typography>
          {isMobile && <CloseButton onClick={onCancelClick} />}
        </Box>
        <Box mb={3} />
        <Typography variant="description">
          • We believe in empowering you to own and control your data in the
          Web3 world! Our site uses Web3 data permissions to enhance your
          experience and offer exciting rewards.
          <br /> • You have the power to own your data and decide how it's used.
          With us, you can lease your data anonymously to brands in exchange for
          fantastic rewards!
          <br /> • We utilize on-chain data, including token balances, NFTs,
          transaction history, and dApps, to provide you with personalized
          experiences and exclusive NFT rewards.
          <br /> • To unlock your one-of-a-kind NFTs, all you need to do is
          share your Web3 data with us. It's quick, easy, and a great way to
          showcase your journey in the decentralized world!
          <br />
          <br />
          <br />
          By clicking "Continue" you agree to our Web3 data permissions policy
          and the terms of data usage. Your privacy matters to us, and we ensure
          your data is protected with top-notch security measures.
          <br />
          Embrace the Web3 revolution and let's embark on a rewarding journey
          together!
        </Typography>
        <Box mb={3} />
        <Grid
          container
          spacing={2}
          {...(isMobile && { flexFlow: "column-reverse" })}
        >
          {!isMobile && (
            <Grid item sm={3}>
              <Button onClick={onCancelClick} fullWidth variant="text">
                Cancel
              </Button>
            </Grid>
          )}
          <Grid item sm={4}>
            <Button onClick={onSetPermissions} fullWidth variant="outlined">
              Select Permissions
            </Button>
          </Grid>
          <Grid item sm={5}>
            <Button onClick={onContinueClick} fullWidth variant="contained">
              Continue
            </Button>
          </Grid>
        </Grid>
        <AcnowledgmentBanner />
      </Box>
    </Box>
  );
};
