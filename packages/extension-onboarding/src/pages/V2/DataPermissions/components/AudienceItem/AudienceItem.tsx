// @TODO move EAlertSeverity to objects
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Hidden,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Skeleton } from "@material-ui/lab";
import {
  EVMContractAddress,
  EWalletDataType,
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  URLString,
} from "@snickerdoodlelabs/objects";
import {
  SDButton,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import { ResultUtils } from "neverthrow-result-utils";
import React, {
  useEffect,
  useRef,
  useState,
  FC,
  useCallback,
  useMemo,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import CustomSDSwitch from "@extension-onboarding/components/v2/Switch/";
import { PERMS } from "@extension-onboarding/constants/permissionsV2";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { generateRouteUrl } from "@extension-onboarding/containers/Router/utils";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { useAccordionStyles } from "@extension-onboarding/styles/accordion.style";

interface IContractInfo {
  metadata: IOldUserAgreement | IUserAgreement;
  urls: URLString[];
}
interface IAudienceItemProps {
  contractAddress: EVMContractAddress;
  ipfsCID: IpfsCID;
}
const AudienceItem: FC<IAudienceItemProps> = ({
  ipfsCID,
  contractAddress,
}: IAudienceItemProps) => {
  const classes = useAccordionStyles();
  const { sdlDataWallet } = useDataWalletContext();
  const lastSetPermissions = useRef<EWalletDataType[]>();
  const [contractInfo, setContractInfo] = useState<IContractInfo>();
  const [permissions, setPermissions] = useState<EWalletDataType[]>();
  const [saveRequired, setSaveRequired] = useState<boolean>(false);
  const [domainVerificationStatus, setDomainVerificationStatus] =
    useState<Map<URLString, boolean>>();
  const { setAlert } = useNotificationContext();
  const { setLoadingStatus } = useLayoutContext();
  // const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    if (permissions) {
      if (!lastSetPermissions.current) {
        lastSetPermissions.current = permissions;
      } else {
        if (permissions.length !== lastSetPermissions.current.length) {
          setSaveRequired(true);
        } else {
          if (
            Array.from(new Set(permissions.concat(lastSetPermissions.current)))
              .length !== permissions.length
          ) {
            setSaveRequired(true);
          } else {
            setSaveRequired(false);
          }
        }
      }
    }
  }, [permissions]);

  const onSaveClick = useCallback(() => {
    if (!lastSetPermissions.current) {
      return;
    }
    if (!permissions) {
      return;
    }
    const dataTypeDiff = [
      ...new Set([...permissions, ...lastSetPermissions.current]),
    ].filter(
      (item) =>
        permissions.includes(item) !==
        (lastSetPermissions.current || []).includes(item),
    );
    setLoadingStatus(true);
    sdlDataWallet
      .updateAgreementPermissions(contractAddress, dataTypeDiff)
      .map(() => {
        setSaveRequired(false);
        setLoadingStatus(false);
        lastSetPermissions.current = permissions;
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: "Data Permissions updated successfully.",
        });
      })
      .mapErr((err) => {
        console.log(err);
        setAlert({
          severity: EAlertSeverity.ERROR,
          message: "Error updating data permissions!",
        });
        setLoadingStatus(false);
      });
  }, [permissions]);

  const getInitialData = () => {
    return ResultUtils.combine([
      sdlDataWallet.getInvitationMetadataByCID(ipfsCID),
      sdlDataWallet.getConsentContractURLs(contractAddress),
    ])
      .andThen(([metadata, urls]) => {
        setContractInfo({ metadata, urls });
        return sdlDataWallet
          .getAgreementPermissions(contractAddress)
          .map((permissions) => {
            setPermissions(permissions);
          })
          .mapErr((err) => {
            console.log(err);
          });
      })
      .mapErr((err) => {
        console.log("Error getting contract initial data", err);
      });
  };

  useEffect(() => {
    if (!contractInfo) {
      return;
    }
    getURLVerificationStatuses();
  }, [contractInfo]);

  const getURLVerificationStatuses = useCallback(() => {
    if (!contractInfo?.urls?.length) {
      return;
    }
    const urls = contractInfo.urls;
    // todo get verification status for each url
  }, [contractInfo?.urls?.length]);

  const title = useMemo(() => {
    if (!contractInfo) {
      return <Skeleton width={100} />;
    }
    if (contractInfo.urls.length) {
      return (
        <Box display="flex">
          {contractInfo.urls.map((url, index) => {
            return (
              <SDTypography
                key={index}
                variant="titleMd"
                color="textHeading"
                fontWeight="medium"
              >
                {url}
              </SDTypography>
            );
          })}
        </Box>
      );
    }
    if (contractInfo.metadata["attributes"]) {
      return (
        <SDTypography variant="titleMd" color="textHeading" fontWeight="medium">
          {(contractInfo.metadata as IUserAgreement).name}
        </SDTypography>
      );
    }
    return (
      <SDTypography variant="titleMd" color="textHeading" fontWeight="medium">
        {(contractInfo.metadata as IOldUserAgreement).title}
      </SDTypography>
    );
  }, [JSON.stringify(contractInfo)]);

  return (
    <Accordion
      // expanded={isExpanded}
      // onChange={() => {
      //   setIsExpanded(!isExpanded);
      // }}
      TransitionProps={{ timeout: 0 }}
      classes={{
        root: clsx(classes.accordionRoot),
      }}
      elevation={0}
      className={classes.accordion}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "unset", sm: "center" }}
          width="100%"
        >
          {title}
          <Box ml="auto" mt={{ xs: 3, sm: "unset" }} />
          {saveRequired ? (
            <Box display="flex" alignItems="center">
              <SDButton
                onClick={(e) => {
                  e.stopPropagation();
                  setPermissions(lastSetPermissions.current);
                }}
                variant="outlined"
              >
                Discard
              </SDButton>
              <Box ml={2} />
              <SDButton
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveClick();
                }}
              >
                Apply
              </SDButton>
            </Box>
          ) : (
            <SDButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  generateRouteUrl(EPathsV2.DATA_PERMISSIONS_AUDIENCE, {
                    consentAddress: contractAddress,
                  }),
                  { state: { _contractInfo: contractInfo, _ipfsCID: ipfsCID } },
                );
              }}
              variant="outlined"
            >
              Manage
            </SDButton>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%">
          {PERMS.map((permission, index) => {
            return (
              <Box key={permission.key}>
                <Box
                  mb={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <SDTypography
                      variant="titleSm"
                      fontWeight="medium"
                      color="textHeading"
                    >
                      {permission.name}
                    </SDTypography>
                    <Hidden xsDown>
                      <Box mt={1}>
                        <SDTypography variant="titleXs" color="textBody">
                          {permission.description}
                        </SDTypography>
                      </Box>
                    </Hidden>
                  </Box>
                  <CustomSDSwitch
                    onClick={() => {
                      permissions?.includes(permission.key)
                        ? setPermissions((p) =>
                            p?.filter((perm) => perm !== permission.key),
                          )
                        : setPermissions((p) => [...(p ?? []), permission.key]);
                    }}
                    checked={
                      permissions ? permissions.includes(permission.key) : false
                    }
                  />
                </Box>
                {index !== PERMS.length - 1 && (
                  <>
                    <Divider />
                    <Box mt={2} />
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(AudienceItem);
