import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Theme, makeStyles } from "@material-ui/core/styles";
import { IUserAgreement } from "@snickerdoodlelabs/objects";
import parse from "html-react-parser";
import React, { FC, useCallback, useMemo } from "react";

import {
  SDTypography,
  Image,
  SDButton,
  CloseButton,
  SDCheckbox,
} from "@shared-components/v2/components";
import { useResponsiveValue, useSafeState } from "@shared-components/v2/hooks";
import { useDialogStyles } from "@shared-components/v2/styles";
import { colors, typograpyVariants } from "@shared-components/v2/theme";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) => ({
  "@keyframes appear": {
    from: {
      scale: 0.95,
      opacity: 0.5,
    },
    to: {
      scale: 1,
      opacity: 1,
    },
  },
  mountAnimation: {
    animation: "$appear 0.1s ease-in-out",
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

interface ITermsAndConditionsProps {
  defaultConsentData?: IUserAgreement;
  consentData: IUserAgreement;
}
const TermsAndConditions: FC<ITermsAndConditionsProps> = ({
  defaultConsentData,
  consentData,
}) => {
  const [activeTab, setActiveTab] = useSafeState<0 | 1>(0);
  const classes = useStyles();
  const getContent = useCallback((data: IUserAgreement) => {
    const agreementTitle =
      data.attributes.find((attr) => attr.trait_type === "title")?.value ??
      "Your Data, Your Choice.";
    const descriptionText = data.description;
    if (!descriptionText) {
      return (
        <>
          <SDTypography
            variant="titleSm"
            color="textHeading"
            fontWeight="bold"
            align="center"
            mb={3}
          >
            {agreementTitle}
          </SDTypography>
          <SDTypography variant="bodyMd">
            We believe you deserve control over your own data. Here's why we're
            offering a new way - a better way:
            <br />
            <br /> • <strong> Empowerment:</strong> It's your data. We're here
            to ensure you retain control and ownership, always.
            <br /> • <strong>Privacy First:</strong> Thanks to our integration
            with Snickerdoodle, we ensure your data remains anonymous and
            private by leveraging their proprietary tech and Zero Knowledge
            Proofs.
            <br /> • <strong>Enhanced Experience:</strong> Sharing your web3
            data, like token balances, NFTs, and transaction history, allows you
            to access unique experiences tailored just for you.
            <br /> • <strong>Exclusive Rewards:</strong> Unlock exclusive NFTs
            as rewards for sharing your data. It's our way of saying thanks.
            <br />
            <br />
            By clicking "Accept," you acknowledge our web3 data permissions
            policy and terms. Remember, your privacy is paramount to us; we've
            integrated with Snickerdoodle to ensure it.
          </SDTypography>
        </>
      );
    }
    if (descriptionText.trim().startsWith("<")) {
      return (
        <>
          <SDTypography
            variant="titleSm"
            color="textHeading"
            fontWeight="bold"
            align="center"
            mb={3}
          >
            {agreementTitle}
          </SDTypography>
          <span className={classes.rawHtmlWrapper}>
            {parse(descriptionText)}
          </span>
        </>
      );
    }
    return (
      <>
        <SDTypography
          variant="titleSm"
          color="textHeading"
          fontWeight="bold"
          align="center"
          mb={3}
        >
          {agreementTitle}
        </SDTypography>
        <SDTypography variant="bodyMd">{descriptionText}</SDTypography>
      </>
    );
  }, []);
  const getTabs = useMemo(() => {
    if (!defaultConsentData) return null;
    const tabTitles = [
      defaultConsentData?.brandInformation?.name,
      consentData?.brandInformation?.name,
    ];
    return (
      <Box
        display="flex"
        margin="auto"
        maxWidth={{ xs: "100%", sm: "70%" }}
        borderRadius={4}
        overflow="hidden"
        border={`1px solid ${colors.MAINPURPLE100}`}
        mb={{ xs: 2.5, sm: 5.5 }}
      >
        <Grid container>
          {tabTitles.map((title, index) => (
            <Grid key={index} item xs={6}>
              <Box
                py={1.25}
                px={3}
                display="flex"
                justifyContent="center"
                style={{ cursor: activeTab === index ? "default" : "pointer" }}
                bgcolor={
                  activeTab === index ? colors.MAINPURPLE50 : colors.WHITE
                }
                color={
                  activeTab === index ? colors.MAINPURPLE500 : colors.GREY500
                }
                onClick={() => {
                  setActiveTab(index as 0 | 1);
                }}
              >
                <SDTypography
                  noWrap
                  color="inherit"
                  fontWeight="medium"
                  variant="labelLg"
                >
                  {title}
                </SDTypography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }, [
    JSON.stringify(defaultConsentData),
    JSON.stringify(consentData),
    activeTab,
  ]);

  return (
    <Box mt={{ xs: 2, sm: 1 }} px={{ xs: 2, sm: 4.75 }} mb={{ xs: 2, sm: 0 }}>
      {getTabs}
      <Box key={activeTab} className={classes.mountAnimation}>
        {getContent(
          activeTab === 0 && defaultConsentData
            ? defaultConsentData
            : consentData,
        )}
      </Box>
    </Box>
  );
};

interface IConsentProps {
  open: boolean;
  onClose: () => void;
  consentData: IUserAgreement;
  defaultConsentData?: IUserAgreement;
  displayRejectButtons: boolean;
  onTrustClick: () => void;
  onRejectClick?: () => void;
  onRejectWithTimestampClick?: () => void;
}

enum EComponentRenderState {
  RENDER_OPT_IN,
  RENDER_AGREEMENT,
}

export const Consent: FC<IConsentProps> = ({
  open,
  onClose,
  consentData,
  defaultConsentData,
  onTrustClick,
  displayRejectButtons,
  onRejectClick,
  onRejectWithTimestampClick,
}) => {
  const [componentRenderState, setComponentRenderState] = useSafeState(
    EComponentRenderState.RENDER_OPT_IN,
  );
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useSafeState(false);
  const getResponsiveValue = useResponsiveValue();
  const dialogClasses = useDialogStyles({
    maxWidth:
      componentRenderState === EComponentRenderState.RENDER_OPT_IN ? 546 : 700,
  });

  // #region Brand Info
  const brandInfo = useMemo(() => {
    const name = consentData.brandInformation?.name ?? "";
    const logo =
      consentData.brandInformation?.logoImage ?? consentData.image ?? "";
    const description = consentData.brandInformation?.description ?? "";
    return [name, logo, description];
  }, [consentData]);
  // #endregion

  const header = useMemo(() => {
    if (componentRenderState === EComponentRenderState.RENDER_OPT_IN) {
      const [brandName, brandLogo, brandDescription] = brandInfo;
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" width="100%" justifyContent="flex-end">
            <CloseButton
              onClick={() => {
                onClose();
              }}
            />
          </Box>
          <Image
            src={brandLogo}
            width={getResponsiveValue({ xs: 72, sm: 120 })}
            height={getResponsiveValue({ xs: 72, sm: 120 })}
          />
          {brandName && (
            <SDTypography
              hexColor={colors.DARKPURPLE500}
              variant={getResponsiveValue({ xs: "titleLg", sm: "headlineSm" })}
              fontWeight="bold"
              align="center"
              mt={3}
            >
              {brandName}
            </SDTypography>
          )}
          {brandDescription && (
            <SDTypography
              hexColor={colors.GREY600}
              variant={getResponsiveValue({ xs: "bodyMd", sm: "titleMd" })}
              align="center"
              mt={1}
            >
              {brandDescription}
            </SDTypography>
          )}
        </Box>
      );
    } else {
      return (
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <SDTypography color="textHeading" variant="titleLg" fontWeight="bold">
            Terms & Conditions
          </SDTypography>
          <CloseButton
            onClick={() => {
              setComponentRenderState(EComponentRenderState.RENDER_OPT_IN);
            }}
          />
        </Box>
      );
    }
  }, [JSON.stringify(brandInfo), componentRenderState, getResponsiveValue]);

  const content = useMemo(() => {
    if (componentRenderState === EComponentRenderState.RENDER_AGREEMENT) {
      return (
        <TermsAndConditions
          defaultConsentData={defaultConsentData}
          consentData={consentData}
        />
      );
    } else {
      return (
        <Box
          mt={1.5}
          display="flex"
          flexDirection="column"
          alignItems="center"
          px={{ xs: 2, sm: 4.75 }}
          py={{ xs: 2, sm: 0 }}
        >
          <SDCheckbox
            checked={termsAndConditionsAccepted}
            onChange={() => {
              setTermsAndConditionsAccepted(!termsAndConditionsAccepted);
            }}
            label={
              <SDTypography color="textBody" variant="bodyMd">
                I agree to the{" "}
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setComponentRenderState(
                      EComponentRenderState.RENDER_AGREEMENT,
                    );
                  }}
                >
                  {`${brandInfo[0]} Privacy Policy`}
                </span>
              </SDTypography>
            }
          />
          <Box mt={5.5} />
          <SDButton
            disabled={!termsAndConditionsAccepted}
            fullWidth
            onClick={onTrustClick}
          >
            I Trust This Brand
          </SDButton>
          {displayRejectButtons && (
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="center"
              mt={4}
            >
              <SDButton
                variant="text"
                onClick={() => {
                  onRejectClick ? onRejectClick() : onClose();
                }}
              >
                Don’t show me this again
              </SDButton>
              <SDButton
                variant="text"
                onClick={() => {
                  onRejectWithTimestampClick
                    ? onRejectWithTimestampClick()
                    : onClose();
                }}
              >
                Remind me later
              </SDButton>
            </Box>
          )}
        </Box>
      );
    }
  }, [componentRenderState, termsAndConditionsAccepted, displayRejectButtons]);

  return (
    <Dialog fullWidth open={open} className={dialogClasses.dialog}>
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      {componentRenderState === EComponentRenderState.RENDER_AGREEMENT && (
        <DialogActions>
          <Box
            display="flex"
            key={EComponentRenderState.RENDER_AGREEMENT}
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <SDButton
              color="primary"
              onClick={() => {
                setComponentRenderState(EComponentRenderState.RENDER_OPT_IN);
                setTermsAndConditionsAccepted(true);
              }}
            >
              Got It
            </SDButton>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};
