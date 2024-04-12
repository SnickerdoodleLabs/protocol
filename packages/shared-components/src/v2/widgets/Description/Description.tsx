import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  SDTypography,
  SDButton,
  CloseButton,
  AcnowledgmentBanner,
} from "@shared-components/v2/components";
import { useMedia } from "@shared-components/v2/hooks";
import { typograpyVariants } from "@shared-components/v2/theme";
import { IOldUserAgreement, IUserAgreement } from "@snickerdoodlelabs/objects";
import parse from "html-react-parser";
import React, { FC, useMemo } from "react";
interface IDescriptionProps {
  invitationData: IOldUserAgreement | IUserAgreement;
  onCancelClick: () => void;
  onContinueClick: () => void;
  onSetPermissions: () => void;
  onRejectClick: () => void;
  onRejectWithTimestampClick?: () => void;
  primaryButtonText?: string;
  redirectRequired?: boolean;
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
  primaryButtonText = "Continue",
  onRejectClick,
  onRejectWithTimestampClick,
  redirectRequired = false,
}) => {
  const media = useMedia();
  const classes = useStyles();
  const isMobile = useMemo(() => media === "xs", [media]);
  const title = useMemo(() => {
    if (invitationData["attributes"]) {
      return (invitationData as IUserAgreement).attributes.find(
        (attr) => attr.trait_type === "title",
      )?.value;
    }
    return (invitationData as IOldUserAgreement).title;
  }, [invitationData]);
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
      minWidth={{ xs: "none", sm: "none", md: "680px" }}
      width={{ xs: "calc(95% - 48px)", sm: "70%", md: "40%" }}
      borderRadius={{ xs: 12, sm: 4 }}
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
          <SDTypography variant="titleSm" fontWeight="bold">
            {title || "Your Data, Your Choice."}
          </SDTypography>
          {isMobile && <CloseButton onClick={cancelWithAnimation} />}
        </Box>
        <Box
          mb={0.75}
          display="flex"
          maxHeight={{ xs: "none", sm: "none", md: "50vh" }}
          overflow={{ xs: "none", sm: "none", md: "auto" }}
        >
          {description}
        </Box>
        <Box mb={4} />
        <Grid
          container
          spacing={2}
          justifyContent="center"
          direction={isMobile ? "column-reverse" : "row"}
        >
          <Hidden xsDown>
            <Grid item sm={3}>
              <SDButton onClick={cancelWithAnimation} fullWidth variant="text">
                Cancel
              </SDButton>
            </Grid>
          </Hidden>
          {!redirectRequired && (
            <Grid item sm={4}>
              <SDButton onClick={onSetPermissions} fullWidth variant="outlined">
                Set Permissions
              </SDButton>
            </Grid>
          )}
          <Grid item sm={5}>
            <SDButton
              onClick={onContinueClick}
              color="button"
              fullWidth
              variant="contained"
            >
              {primaryButtonText}
            </SDButton>
          </Grid>
        </Grid>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="center"
          mt={4}
        >
          <SDButton variant="text" onClick={onRejectClick}>
            Don’t show me this again
          </SDButton>
          <SDButton
            variant="text"
            onClick={
              onRejectWithTimestampClick
                ? onRejectWithTimestampClick
                : cancelWithAnimation
            }
          >
            Remind me later
          </SDButton>
        </Box>
        <AcnowledgmentBanner />
      </Box>
    </Box>
  );
};
