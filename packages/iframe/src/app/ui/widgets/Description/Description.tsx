import { IOldUserAgreement } from "@snickerdoodlelabs/objects";
import parse from "html-react-parser";
import React, { FC, useMemo } from "react";

import { AcnowledgmentBanner } from "@core-iframe/app/ui/components/AcknowledgmentBanner";
import { CloseButton } from "@core-iframe/app/ui/components/CloseButton";
import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  ITheme,
  useMedia,
  createUseStyles,
} from "@core-iframe/app/ui/lib";

interface IDescriptionProps {
  invitationData: IOldUserAgreement;
  onCancelClick: () => void;
  onContinueClick: () => void;
  onSetPermissions: () => void;
}

const useStyles = createUseStyles({
  "@keyframes disappear": {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  },
  unmountAnimation: {
    animation: "$disappear 0.4s ease-in-out",
  },
  rawHtmlWrapper: {
    color: ({ theme }: { theme: ITheme }) => theme.palette.text,
    fontSize: ({ theme }: { theme: ITheme }) => theme.typography.body.fontSize,
    fontFamily: ({ theme }: { theme: ITheme }) =>
      theme.typography.body.fontFamily,
    lineHeight: 1.45,
    "& h1": {
      ...({ theme }: { theme: ITheme }) => theme.typography.title,
    },
    "& h2": {
      ...({ theme }: { theme: ITheme }) => theme.typography.title2,
    },
    "& h3": {
      ...({ theme }: { theme: ITheme }) => theme.typography.subtitle,
    },
    "& a:link": {
      color: ({ theme }: { theme: ITheme }) => theme.palette.linkText,
    },
    "& ol, ul": {
      paddingLeft: "1em",
    },
  },
});

export const Description: FC<IDescriptionProps> = ({
  invitationData,
  onCancelClick,
  onSetPermissions,
  onContinueClick,
}) => {
  const theme = useTheme<ITheme>();
  const classes = useStyles({ theme });
  const media = useMedia();
  const isMobile = useMemo(() => media === "xs", [media]);
  const [unmountAnimation, setUnmountAnimation] =
    React.useState<boolean>(false);
  const description = useMemo(() => {
    const descriptionText = invitationData.description;

    if (!descriptionText) {
      return (
        <Typography variant="description">
          We believe you deserve control over your own data. Here's why we're
          offering a new way - a better way:
          <br />
          <br /> • <strong> Empowerment:</strong> It's your data. We're here to
          ensure you retain control and ownership, always.
          <br /> • <strong>Privacy First:</strong> Thanks to our integration
          with Snickerdoodle, we ensure your data remains anonymous and private
          by leveraging their proprietary tech and Zero Knowledge Proofs.
          <br /> • <strong>Enhanced Experience:</strong> Sharing your web3 data,
          like token balances, NFTs, and transaction history, allows you to
          access unique experiences tailored just for you.
          <br /> • <strong>Exclusive Rewards:</strong> Unlock exclusive NFTs as
          rewards for sharing your data. It's our way of saying thanks.
          <br />
          <br />
          By clicking "Accept," you acknowledge our web3 data permissions policy
          and terms. Remember, your privacy is paramount to us; we've integrated
          with Snickerdoodle to ensure it.
        </Typography>
      );
    }
    if (descriptionText.trim().startsWith("<")) {
      return (
        <span className={classes.rawHtmlWrapper}>{parse(descriptionText)}</span>
      );
    }
    return <Typography variant="description">{descriptionText}</Typography>;
  }, [JSON.stringify(invitationData), JSON.stringify(theme)]);

  const cancelWithAnimation = () => {
    setUnmountAnimation(true);
    setTimeout(onCancelClick, 400);
  };
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
      className={unmountAnimation ? classes.unmountAnimation : undefined}
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
            {invitationData.title || "Your Data, Your Choice."}
          </Typography>
          {isMobile && <CloseButton onClick={cancelWithAnimation} />}
        </Box>
        <Box mb={0.5} />
        {description}
        <Box mb={4} />
        <Grid
          container
          spacing={2}
          {...(isMobile && { flexFlow: "column-reverse" })}
        >
          {!isMobile && (
            <Grid item sm={3}>
              <Button onClick={cancelWithAnimation} fullWidth variant="text">
                Cancel
              </Button>
            </Grid>
          )}
          <Grid item sm={4}>
            <Button onClick={onSetPermissions} fullWidth variant="outlined">
              Set Permissions
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
