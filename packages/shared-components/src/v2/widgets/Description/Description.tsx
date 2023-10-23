import { Box, Grid, Hidden, Theme, makeStyles } from "@material-ui/core";
import {
  SDTypography,
  SDButton,
  CloseButton,
  AcnowledgmentBanner,
} from "@shared-components/v2/components";
import { useMedia } from "@shared-components/v2/hooks";
import { typograpyVariants } from "@shared-components/v2/theme";
import { IOldUserAgreement } from "@snickerdoodlelabs/objects";
import parse from "html-react-parser";
import React, { FC, useMemo } from "react";
interface IDescriptionProps {
  invitationData: IOldUserAgreement;
  onCancelClick: () => void;
  onContinueClick: () => void;
  onSetPermissions: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
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
    color: theme.palette.textBody,
    fontSize: typograpyVariants.bodyMd.fontSize,
    fontFamily: theme.typography.fontFamily,
    lineHeight: 1.45,
    "& h1": {
      ...typograpyVariants.titleLg,
    },
    "& h2": {
      ...typograpyVariants.titleMd,
    },
    "& h3": {
      ...typograpyVariants.titleSm,
    },
    "& a:link": {
      color: theme.palette.textLink,
    },
    "& ol, ul": {
      paddingLeft: "1em",
    },
  },
}));

export const DescriptionWidget: FC<IDescriptionProps> = ({
  invitationData,
  onCancelClick,
  onSetPermissions,
  onContinueClick,
}) => {
  const media = useMedia();
  const classes = useStyles();
  const isMobile = useMemo(() => media === "xs", [media]);
  const [unmountAnimation, setUnmountAnimation] =
    React.useState<boolean>(false);
  const description = useMemo(() => {
    const descriptionText = invitationData.description;

    if (!descriptionText) {
      return (
        <SDTypography variant="bodyMd">
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
        </SDTypography>
      );
    }
    if (descriptionText.trim().startsWith("<")) {
      return (
        <span className={classes.rawHtmlWrapper}>{parse(descriptionText)}</span>
      );
    }
    return <SDTypography variant="bodyMd">{descriptionText}</SDTypography>;
  }, [JSON.stringify(invitationData)]);

  const cancelWithAnimation = () => {
    setUnmountAnimation(true);
    setTimeout(onCancelClick, 400);
  };
  return (
    <Box
      display="flex"
      bgcolor="cardBgColor"
      m="auto"
      p={{ xs: 3, sm: 4 }}
      pt={{ xs: 3, sm: 8 }}
      width={{ xs: "calc(95% - 48px)", sm: "40%" }}
      borderRadius={{ xs: 12, sm: 0 }}
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
          <SDTypography variant="displaySm">
            {invitationData.title || "Your Data, Your Choice."}
          </SDTypography>
          {isMobile && <CloseButton onClick={cancelWithAnimation} />}
        </Box>
        <Box mb={0.5} />
        {description}
        <Box mb={4} />
        <Grid
          container
          spacing={2}
          direction={isMobile ? "column-reverse" : "row"}
        >
          <Hidden xsDown>
            <Grid item sm={3}>
              <SDButton onClick={cancelWithAnimation} fullWidth variant="text">
                Cancel
              </SDButton>
            </Grid>
          </Hidden>
          <Grid item sm={4}>
            <SDButton onClick={onSetPermissions} fullWidth variant="outlined">
              Set Permissions
            </SDButton>
          </Grid>
          <Grid item sm={5}>
            <SDButton
              onClick={onContinueClick}
              color="button"
              fullWidth
              variant="contained"
            >
              Continue
            </SDButton>
          </Grid>
        </Grid>
        <AcnowledgmentBanner />
      </Box>
    </Box>
  );
};
