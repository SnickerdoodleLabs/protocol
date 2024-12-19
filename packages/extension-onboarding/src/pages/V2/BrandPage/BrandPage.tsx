import Box from "@material-ui/core/Box";
import MuiContainer from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import CallMade from "@material-ui/icons/CallMade";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  EVMContractAddress,
  IUserAgreement,
  QueryStatus,
} from "@snickerdoodlelabs/objects";
import {
  Image,
  SDTypography,
  colors,
  useSafeState,
  useResponsiveValue,
  SDButton,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import Container from "@extension-onboarding/components/v2/Container";
import NavigationBar, {
  UnAuthNavigationBar,
} from "@extension-onboarding/components/v2/NavigationBar";
import {
  CombinedOfferItem,
  SingleQuestionnaireOfferItem,
  SingleVirtualQuestionnaireOfferItem,
} from "@extension-onboarding/components/v2/OfferItems";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { calculateOffers } from "@extension-onboarding/utils/OfferUtils";

const BrandPage: FC = () => {
  const { setAlert } = useNotificationContext();
  const { sdlDataWallet } = useDataWalletContext();
  const { isDefaultContractOptedIn, optedInContracts } = useAppContext();
  const { consentContractAddress } = useParams<{
    consentContractAddress: EVMContractAddress;
  }>();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useSafeState(true);
  const navigate = useNavigate();
  const getResponsiveValue = useResponsiveValue();
  const [contractInfo, setContractInfo] = useSafeState<IUserAgreement>();
  const [queryStatuses, setQueryStatuses] = useSafeState<QueryStatus[]>();

  const isConsentContractOptedIn = useMemo(() => {
    return optedInContracts?.has(consentContractAddress!);
  }, [optedInContracts, consentContractAddress]);
  useEffect(() => {
    if (!contractInfo) {
      fetchContractInfo().andThen(getQueryStatuses);
    }
  }, []);

  const fetchContractInfo = useCallback(() => {
    return sdlDataWallet
      .getConsentContractCID(consentContractAddress!)
      .andThen((cid) => {
        return sdlDataWallet.getInvitationMetadataByCID(cid).map((metadata) => {
          setContractInfo(metadata);
        });
      })
      .mapErr((err) => {
        setAlert({
          message:
            "The URL you provided does not have a valid consent contract address associated with any brand. Please check the URL and try again",
          severity: EAlertSeverity.ERROR,
        });
      });
  }, []);

  const getQueryStatuses = useCallback(() => {
    return sdlDataWallet
      .getQueryStatusesByContractAddress(consentContractAddress!)
      .map((statuses) => {
        setQueryStatuses(statuses);
      });
  }, []);

  useEffect(() => {
    if (contractInfo) {
      setIsLoading(false);
    }
  }, [contractInfo]);

  const calculatedOffers = useMemo(() => {
    if (!queryStatuses) {
      return;
    }
    return calculateOffers(queryStatuses);
  }, [JSON.stringify(queryStatuses)]);

  return (
    <>
      {isDefaultContractOptedIn ? (
        <NavigationBar />
      ) : (
        <UnAuthNavigationBar
          component={
            <Box
              color="white"
              display="flex"
              flex={1}
              justifyContent="flex-end"
            >
              <SDButton
                color="inherit"
                variant="outlined"
                onClick={() => {
                  sdlDataWallet.requestOptIn(
                    isConsentContractOptedIn
                      ? undefined
                      : consentContractAddress!,
                  );
                }}
                fullWidth
                endIcon={<CallMade />}
                style={getResponsiveValue({
                  xs: {
                    maxHeight: 36,
                    height: 36,
                    maxWidth: 100,
                  },
                  sm: {
                    maxHeight: 48,
                    height: 48,
                    maxWidth: 128,
                  },
                })}
              >
                Sign Up
              </SDButton>
            </Box>
          }
        />
      )}
      <Image
        width="100vw"
        height="calc(100vw * 260 / 1440)"
        src={contractInfo?.brandInformation?.coverImage ?? ""}
        style={{
          aspectRatio: "1440/260",
          objectFit: "cover",
          width: "100%",
          height: "100%",
          verticalAlign: "bottom",
        }}
      />
      <Box display="flex" flexDirection="column" bgcolor={colors.WHITE}>
        <MuiContainer maxWidth="lg" style={{ position: "relative" }}>
          <Box
            position="absolute"
            width={{ xs: 124, sm: 164 }}
            height={{ xs: 124, sm: 164 }}
            borderRadius={12}
            top={-46}
            left={{ xs: 0, sm: "unset" }}
            right={{ xs: 0, sm: "unset" }}
            margin={{ xs: "auto", sm: "unset" }}
            padding={0.25}
            bgcolor={colors.WHITE}
          >
            <Image
              src={
                contractInfo?.brandInformation?.logoImage ??
                contractInfo?.image ??
                ""
              }
              width="100%"
              height="100%"
              style={{
                borderRadius: 12,
                border: "1px solid rgba(0, 0, 0, 0.15)",
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box
            mt={{ xs: 10.5, sm: 4 }}
            mb={{ xs: 2, sm: 5.5 }}
            ml={{ xs: 0, sm: 24.5 }}
            display="flex"
            flexDirection="column"
          >
            <Box
              display="flex"
              alignItems={{ xs: "unset", sm: "flex-end" }}
              flexDirection={{ xs: "column", sm: "row" }}
            >
              <Box mr={4}>
                <SDTypography
                  mb={{ xs: 0.5, sm: 1.5 }}
                  color="textHeading"
                  fontWeight="bold"
                  align={getResponsiveValue({
                    xs: "center",
                    sm: "left",
                  })}
                  variant={getResponsiveValue({
                    xs: "titleXl",
                    sm: "displaySm",
                  })}
                >
                  {contractInfo ? (
                    contractInfo.brandInformation?.name
                  ) : (
                    <Skeleton width={100} />
                  )}
                </SDTypography>
                <SDTypography
                  color="textSubtitle"
                  variant={getResponsiveValue({ xs: "bodyMd", sm: "bodyXl" })}
                >
                  {contractInfo ? (
                    contractInfo.brandInformation?.description
                  ) : (
                    <Skeleton width={200} />
                  )}
                </SDTypography>
              </Box>
              {!isConsentContractOptedIn && (
                <Box
                  mt={{ xs: 2, sm: 0 }}
                  ml={{ xs: "unset", sm: "auto" }}
                  flex={1}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <SDButton
                    fullWidth
                    onClick={() => {
                      sdlDataWallet.requestOptIn(consentContractAddress!);
                    }}
                    style={getResponsiveValue({
                      xs: {
                        maxHeight: 44,
                        height: 44,
                      },
                      sm: {
                        maxHeight: 56,
                        height: 56,
                        maxWidth: 235,
                      },
                    })}
                  >
                    Join Us
                  </SDButton>
                </Box>
              )}
            </Box>
          </Box>
        </MuiContainer>
        <Divider />
      </Box>
      <Container>
        <>
          <Box mt={2} />
          {calculatedOffers ? (
            <>
              {calculatedOffers.questionnaireQueries.length > 0 && (
                <>
                  <SDTypography
                    color="textHeading"
                    fontWeight="bold"
                    variant="headlineMd"
                    mt={5}
                    mb={1.5}
                  >
                    Tell Us About Yourself
                  </SDTypography>
                  <SDTypography
                    mb={2.5}
                    variant="bodyLg"
                    hexColor={colors.GREY600}
                  >
                    We’d love to learn more about you
                  </SDTypography>
                </>
              )}

              {calculatedOffers.questionnaireQueries.map((offer) => (
                <SingleQuestionnaireOfferItem
                  disabled={!isConsentContractOptedIn}
                  key={offer.queryStatus.queryCID}
                  brandImage={
                    contractInfo?.brandInformation?.logoImage ??
                    contractInfo?.image ??
                    ""
                  }
                  offer={offer}
                  onProcceed={() => {}}
                />
              ))}
              {calculatedOffers.virtualQuestionnaireQueries.length > 0 && (
                <>
                  <SDTypography
                    color="textHeading"
                    fontWeight="bold"
                    variant="headlineMd"
                    mt={5}
                    mb={2.5}
                  >
                    Data Points
                  </SDTypography>
                </>
              )}
              {calculatedOffers.virtualQuestionnaireQueries.map((offer) => (
                <SingleVirtualQuestionnaireOfferItem
                  disabled={!isConsentContractOptedIn}
                  key={offer.queryStatus.queryCID}
                  brandImage={
                    contractInfo?.brandInformation?.logoImage ??
                    contractInfo?.image ??
                    ""
                  }
                  offer={offer}
                  onProcceed={() => {}}
                />
              ))}
              {calculatedOffers.multiQuestionQueries.length > 0 && (
                <>
                  <SDTypography
                    color="textHeading"
                    fontWeight="bold"
                    variant="headlineMd"
                    mt={5}
                    mb={2.5}
                  >
                    Multi Question Offers
                  </SDTypography>
                </>
              )}
              {calculatedOffers.multiQuestionQueries.map((offer) => (
                <CombinedOfferItem
                  disabled={!isConsentContractOptedIn}
                  key={offer.queryStatus.queryCID}
                  brandImage={
                    contractInfo?.brandInformation?.logoImage ??
                    contractInfo?.image ??
                    ""
                  }
                  offer={offer}
                  onProcceed={() => {}}
                />
              ))}
            </>
          ) : null}
        </>
      </Container>
    </>
  );
};

export default BrandPage;
